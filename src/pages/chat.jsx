import { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { getCurrentUser } from "../datas/acc";
import { LanguageContext } from "../components/LanguageContext";
import "./chat.css";

// 🔥 Icons according to each role
import doctorIcon from "/img/doctorIcons.png";
import adminIcon from "/img/adminIcon.webp";
import userIcon from "/img/userIcon.png";

// APIs
const APPOINT_API =
  "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";

const CHAT_ROOMS_API =
  "https://6921f989512fb4140be1ead3.mockapi.io/chatRooms";
const CHAT_MESSAGES_API =
  "https://6921f989512fb4140be1ead3.mockapi.io/chatMessages";

const ADMIN_CHATS_API =
  "https://691205be52a60f10c8205121.mockapi.io/adminChats";
const ADMIN_MESSAGES_API =
  "https://691b3e462d8d785575722661.mockapi.io/adminMessages";

const Chat = () => {
  const user = getCurrentUser();
  const { language, text: langText } = useContext(LanguageContext);
  const t = langText[language].chat;

  const [mode, setMode] = useState("rooms");

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const [adminChats, setAdminChats] = useState([]);
  const [activeAdminChat, setActiveAdminChat] = useState(null);
  const [adminMessages, setAdminMessages] = useState([]);

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingAdminChats, setLoadingAdminChats] = useState(false);
  const [loadingAdminMessages, setLoadingAdminMessages] = useState(false);

  const isAdmin = user?.role === "admin";
  const isPatient = user?.role === "patient";
  const isDoctor = user?.role === "doctor";

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);

    return d.toLocaleTimeString(
      language === "TH" ? "th-TH" : "en-US",
      { hour: "2-digit", minute: "2-digit" }
    );
  };

  const normalize = (t) =>
    (t || "").toString().trim().toLowerCase();

  const matchDoctorFlexible = (appointmentDoctor, doctorUser) => {
    if (!appointmentDoctor || !doctorUser) return false;

    const a = normalize(appointmentDoctor);
    const b = normalize(doctorUser);

    if (a.includes(b)) return true;
    if (b.includes(a)) return true;

    const cleanA = a
      .replace("dr.", "").replace("doctor", "").replace("หมอ", "").trim();
    const cleanB = b
      .replace("dr.", "").replace("doctor", "").replace("หมอ", "").trim();

    if (cleanA === cleanB) return true;
    if (cleanA.includes(cleanB)) return true;
    if (cleanB.includes(cleanA)) return true;

    return false;
  };

  const myUnreadField =
    isPatient ? "unreadForPatient" :
    isDoctor ? "unreadForDoctor" :
    null;

  const otherUnreadField =
    isPatient ? "unreadForDoctor" :
    isDoctor ? "unreadForPatient" :
    null;

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const scale = img.width > maxWidth ? maxWidth / img.width : 1;

          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Canvas empty"));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ======================
  // Avatar by role
  // ======================
  const getAvatarByRole = (role) => {
    if (role === "doctor") return doctorIcon;
    if (role === "admin") return adminIcon;
    return userIcon;
  };

  const getSidebarAvatar = (room) => {
    if (isPatient) return doctorIcon;
    if (isDoctor) return userIcon;
    return adminIcon;
  };

  const getHeaderAvatar = () => {
    if (isPatient) return doctorIcon;
    if (isDoctor) return userIcon;
    if (isAdmin) return adminIcon;
    return userIcon;
  };

  const getBubbleAvatar = (msg) => getAvatarByRole(msg.senderRole);
  const usingAdminMode = mode === "admin";

  // ==========================
  // 1) Generate rooms (appointments → rooms)
  // ==========================

  const ensureRoomsFromAppointments = async () => {
    if (!isPatient && !isDoctor) return;

    try {
      const resApp = await axios.get(APPOINT_API);
      let apps = resApp.data || [];

      apps = apps.filter((a) => a.status === "confirmed");

      if (isPatient) {
        apps = apps.filter((a) => a.user === user.username);
      }

      if (isDoctor) {
        apps = apps.filter((a) =>
          matchDoctorFlexible(a.doctor, user.username)
        );
      }

      const resRooms = await axios.get(CHAT_ROOMS_API);
      const allRooms = resRooms.data || [];

      for (const app of apps) {
        const exist = allRooms.find(
          (r) =>
            String(r.appointmentId) === String(app.id) &&
            r.patientUsername === app.user &&
            matchDoctorFlexible(r.doctorUsername, app.doctor)
        );

        if (exist) continue;

        const newRoom = {
          appointmentId: String(app.id),
          patientUsername: app.user,
          doctorUsername: app.doctor,
          patientName: `${app.firstName || ""} ${app.lastName || ""}`.trim(),
          doctorName: app.doctor,

          // 🔥 ICON FIXED
          patientAvatar: userIcon,
          doctorAvatar: doctorIcon,

          lastMessage: "",
          unreadForPatient: 0,
          unreadForDoctor: 0,
          updatedAt: new Date().toISOString(),
        };

        await axios.post(CHAT_ROOMS_API, newRoom);
      }
    } catch (err) {
      console.error("ensureRoomsFromAppointments error:", err);
    }
  };

  // ==========================
  // 2) Load chat rooms
  // ==========================

  const fetchRooms = async () => {
    if (!user) return;

    try {
      setLoadingRooms(true);

      const res = await axios.get(CHAT_ROOMS_API);
      let data = res.data || [];

      if (isPatient) {
        data = data.filter((r) => r.patientUsername === user.username);
      } else if (isDoctor) {
        data = data.filter((r) =>
          matchDoctorFlexible(r.doctorUsername, user.username)
        );
      }

      const dedup = new Map();
      for (const r of data) {
        const key = `${r.appointmentId}::${r.patientUsername}::${r.doctorUsername}`;
        if (!dedup.has(key)) dedup.set(key, r);
        else {
          const old = dedup.get(key);
          if (new Date(r.updatedAt) > new Date(old.updatedAt)) {
            dedup.set(key, r);
          }
        }
      }

      data = Array.from(dedup.values());

      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      setRooms(data);
      if (!activeRoom && data.length > 0) {
        setActiveRoom(data[0]);
      }
    } catch (err) {
      console.error("fetchRooms error:", err);
    } finally {
      setLoadingRooms(false);
    }
  };

  // ==========================
  // 3) Load messages (patient–doctor)
  // ==========================

  const fetchMessages = async (room, first = false) => {
    if (!room) return;

    try {
      if (first) setLoadingMessages(true);

      const res = await axios.get(
        `${CHAT_MESSAGES_API}?roomId=${room.id}`
      );
      const msgs = (res.data || []).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setMessages(msgs);

      if (myUnreadField && room[myUnreadField] > 0) {
        const updated = { ...room, [myUnreadField]: 0 };
        await axios.put(`${CHAT_ROOMS_API}/${room.id}`, updated);

        setActiveRoom(updated);
        setRooms((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
      }
    } catch (err) {
      console.error("fetchMessages error:", err);
    } finally {
      if (first) setLoadingMessages(false);
    }
  };

  // ==========================
  // 4) Load admin chat rooms
  // ==========================

  const fetchAdminChats = async () => {
    if (!user) return;

    try {
      setLoadingAdminChats(true);

      const res = await axios.get(ADMIN_CHATS_API);
      let data = res.data || [];

      if (isPatient) {
        data = data.filter((c) => c.targetUsername === user.username);
      }

      data = data.map((c) => ({
        ...c,
        targetAvatar: userIcon, // ผู้ใช้งานคือคนไข้ → admin เห็น userIcon
      }));

      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      setAdminChats(data);
      if (!activeAdminChat && data.length > 0) {
        setActiveAdminChat(data[0]);
      }
    } catch (err) {
      console.error("fetchAdminChats error:", err);
    } finally {
      setLoadingAdminChats(false);
    }
  };

  // ==========================
  // 5) Load admin messages
  // ==========================

  const fetchAdminMessages = async (chat, first = false) => {
    if (!chat) return;

    try {
      if (first) setLoadingAdminMessages(true);

      const res = await axios.get(
        `${ADMIN_MESSAGES_API}?chatId=${chat.id}`
      );
      const msgs = (res.data || []).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setAdminMessages(msgs);

      if (isAdmin && chat.unreadForAdmin > 0) {
        const updated = { ...chat, unreadForAdmin: 0 };
        await axios.put(`${ADMIN_CHATS_API}/${chat.id}`, updated);
        setActiveAdminChat(updated);

        setAdminChats((p) =>
          p.map((c) => (c.id === updated.id ? updated : c))
        );
      } else if (isPatient && (chat.unreadForTarget || 0) > 0) {
        const updated = { ...chat, unreadForTarget: 0 };
        await axios.put(`${ADMIN_CHATS_API}/${chat.id}`, updated);
        setActiveAdminChat(updated);

        setAdminChats((p) =>
          p.map((c) => (c.id === updated.id ? updated : c))
        );
      }
    } catch (err) {
      console.error("fetchAdminMessages error:", err);
    } finally {
      if (first) setLoadingAdminMessages(false);
    }
  };

  // ==========================
  // Initial load + polling
  // ==========================

  useEffect(() => {
    if (!user) return;

    (async () => {
      await ensureRoomsFromAppointments();
      await fetchRooms();
      await fetchAdminChats();
    })();
  }, [user?.username]);

  useEffect(() => {
    if (!activeRoom) return;
    fetchMessages(activeRoom, true);
    const timer = setInterval(() => fetchMessages(activeRoom, false), 10000);
    return () => clearInterval(timer);
  }, [activeRoom?.id]);

  useEffect(() => {
    if (!activeAdminChat) return;
    fetchAdminMessages(activeAdminChat, true);
    const timer = setInterval(() => fetchAdminMessages(activeAdminChat, false), 10000);
    return () => clearInterval(timer);
  }, [activeAdminChat?.id]);

  useEffect(() => {
    if (!user) return;
    const t1 = setInterval(fetchRooms, 10000);
    const t2 = setInterval(fetchAdminChats, 10000);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, [user?.role]);
  // ==========================
  // Send message – patient / doctor
  // ==========================

  const handleSendRoomMessage = async () => {
    if (!activeRoom) return;
    if (!text.trim() && !imageFile) return;

    try {
      let img = null;
      if (imageFile) {
        const compressed = await compressImage(imageFile);
        img = await fileToBase64(compressed);
      }

      const payload = {
        roomId: activeRoom.id,
        senderRole: user.role,
        senderUsername: user.username,
        text: text.trim(),
        imageData: img,
        createdAt: new Date().toISOString(),
      };

      await axios.post(CHAT_MESSAGES_API, payload);

      const updatedRoom = {
        ...activeRoom,
        lastMessage: payload.text || (img ? "[รูปภาพ]" : ""),
        updatedAt: new Date().toISOString(),
        [otherUnreadField]: (activeRoom[otherUnreadField] || 0) + 1,
      };

      await axios.put(`${CHAT_ROOMS_API}/${activeRoom.id}`, updatedRoom);

      setActiveRoom(updatedRoom);
      setRooms((p) =>
        p.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
      );

      setText("");
      setImageFile(null);
    } catch (err) {
      console.error("sendRoom error:", err);
    }
  };

  // ==========================
  // Send message – admin / patient
  // ==========================

  const handleSendAdminMessage = async () => {
    if (!text.trim() && !imageFile) return;

    try {
      let img = null;
      if (imageFile) {
        const compressed = await compressImage(imageFile);
        img = await fileToBase64(compressed);
      }

      let chat = activeAdminChat;

      if (!chat && isPatient) {
        const newChat = {
          targetUsername: user.username,
          targetName: user.username,
          targetRole: "patient",
          targetAvatar: userIcon,
          lastMessage: "",
          unreadForAdmin: 0,
          unreadForTarget: 0,
          updatedAt: new Date().toISOString(),
        };

        const res = await axios.post(ADMIN_CHATS_API, newChat);
        chat = res.data;

        setActiveAdminChat(chat);
        setAdminChats((prev) => [chat, ...prev]);
      }

      if (!chat) return;

      const payload = {
        chatId: chat.id,
        senderRole: user.role,
        senderUsername: user.username,
        text: text.trim(),
        imageData: img,
        createdAt: new Date().toISOString(),
      };

      await axios.post(ADMIN_MESSAGES_API, payload);

      const updatedChat = {
        ...chat,
        lastMessage: payload.text || (img ? "[รูปภาพ]" : ""),
        updatedAt: new Date().toISOString(),
        unreadForTarget: isAdmin ? (chat.unreadForTarget || 0) + 1 : chat.unreadForTarget,
        unreadForAdmin: isPatient ? (chat.unreadForAdmin || 0) + 1 : chat.unreadForAdmin,
      };

      await axios.put(`${ADMIN_CHATS_API}/${chat.id}`, updatedChat);

      setActiveAdminChat(updatedChat);
      setAdminChats((p) =>
        p.map((c) => (c.id === updatedChat.id ? updatedChat : c))
      );

      setText("");
      setImageFile(null);
    } catch (err) {
      console.error("sendAdmin error:", err);
    }
  };

  // ==========================
  // Memo last-my-message
  // ==========================

  const lastMyMessageId = useMemo(() => {
    const mine = messages.filter((m) => m.senderUsername === user.username);
    return mine.length ? mine[mine.length - 1].id : null;
  }, [messages]);

  const lastMyAdminMessageId = useMemo(() => {
    const mine = adminMessages.filter(
      (m) => m.senderUsername === user.username
    );
    return mine.length ? mine[mine.length - 1].id : null;
  }, [adminMessages]);

  // ==========================
  // UI Rendering
  // ==========================

  if (!user) {
    return <div className="chat-container">{t.loginRequired}</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-layout">
        {/* SIDEBAR */}
        <aside className="chat-sidebar">
          <div className="sidebar-header">
            <h5>{t.sidebarHeader}</h5>
            <span>
              {isPatient && t.patientMode}
              {isDoctor && t.doctorMode}
              {isAdmin && t.adminMode}
            </span>

            {(isAdmin || isPatient) && (
              <div className="sidebar-tabs">
                <button
                  className={mode === "rooms" ? "active" : ""}
                  onClick={() => setMode("rooms")}
                >
                  {isAdmin ? t.tabPatientDoctor_AdminView : t.tabPatientDoctor}
                </button>
                <button
                  className={mode === "admin" ? "active" : ""}
                  onClick={() => setMode("admin")}
                >
                  {isAdmin ? t.tabAdmin_AdminView : t.tabAdmin}
                </button>
              </div>
            )}
          </div>

          {/* LIST */}
          {!usingAdminMode ? (
            loadingRooms ? (
              <div className="sidebar-empty">{t.loadingRooms}</div>
            ) : rooms.length === 0 ? (
              <div className="sidebar-empty">{t.noRooms}</div>
            ) : (
              <div className="sidebar-list">
                {rooms.map((room) => {
                  const isActive = activeRoom?.id === room.id;
                  const unread =
                    isPatient ? room.unreadForPatient : room.unreadForDoctor;

                  return (
                    <div
                      key={room.id}
                      className={`sidebar-item ${isActive ? "active" : ""}`}
                      onClick={() => setActiveRoom(room)}
                    >
                      <img
                        src={getSidebarAvatar(room)}
                        className="sidebar-avatar"
                        alt=""
                      />

                      <div className="sidebar-text">
                        <div className="sidebar-name">
                          {isPatient ? room.doctorName : room.patientName}
                        </div>
                        <div className="sidebar-last">
                          {room.lastMessage || t.noLastMessage}
                        </div>
                      </div>

                      <div className="sidebar-meta">
                        {room.updatedAt && (
                          <span>{formatTime(room.updatedAt)}</span>
                        )}
                        {unread > 0 && (
                          <span className="sidebar-unread">{unread}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : loadingAdminChats ? (
            <div className="sidebar-empty">{t.loadingAdminChats}</div>
          ) : adminChats.length === 0 ? (
            <div className="sidebar-empty">
              {isAdmin ? t.noAdminChatsAdmin : t.noAdminChatsPatient}
            </div>
          ) : (
            <div className="sidebar-list">
              {adminChats.map((chat) => {
                const isActive = activeAdminChat?.id === chat.id;
                const unread = isAdmin
                  ? chat.unreadForAdmin
                  : chat.unreadForTarget;

                return (
                  <div
                    key={chat.id}
                    className={`sidebar-item ${isActive ? "active" : ""}`}
                    onClick={() => setActiveAdminChat(chat)}
                  >
                    <img
                      src={isAdmin ? userIcon : adminIcon}
                      className="sidebar-avatar"
                      alt=""
                    />

                    <div className="sidebar-text">
                      <div className="sidebar-name">
                        {isAdmin ? chat.targetName : t.adminDisplayName}
                      </div>
                      <div className="sidebar-last">
                        {chat.lastMessage || t.noLastMessage}
                      </div>
                    </div>

                    <div className="sidebar-meta">
                      {chat.updatedAt && (
                        <span>{formatTime(chat.updatedAt)}</span>
                      )}
                      {unread > 0 && (
                        <span className="sidebar-unread">{unread}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* MAIN CHAT */}
        <section className="chat-main">
          <div className="chat-header">
            <img
              src={getHeaderAvatar()}
              className="chat-header-avatar"
              alt=""
            />

            <div className="chat-header-info">
              <div className="chat-header-name">
                {usingAdminMode
                  ? isAdmin
                    ? activeAdminChat?.targetName
                    : "Admin"
                  : isPatient
                  ? activeRoom?.doctorName
                  : activeRoom?.patientName}
              </div>

              <div className="chat-header-sub">
                {usingAdminMode
                  ? isAdmin
                    ? `${t.adminChatBetweenAdmin} ${activeAdminChat?.targetRole}`
                    : t.adminChatBetweenPatient
                  : isPatient
                  ? t.chatWithDoctor
                  : t.chatWithPatient}
              </div>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="messages-container">
            {(usingAdminMode ? loadingAdminMessages : loadingMessages) ? (
              <div className="messages-loading">{t.loadingMessages}</div>
            ) : (usingAdminMode ? adminMessages : messages).length === 0 ? (
              <div className="messages-empty">{t.noMessages}</div>
            ) : (
              (usingAdminMode ? adminMessages : messages).map((msg) => {
                const isMe = msg.senderUsername === user.username;

                return (
                  <div
                    key={msg.id}
                    className={`msg-bubble ${isMe ? "me" : "other"}`}
                  >
                    {!isMe && (
                      <img
                        src={getBubbleAvatar(msg)}
                        className="avatar"
                        alt=""
                      />
                    )}

                    <div className="bubble">
                      {msg.imageData && (
                        <img
                          src={msg.imageData}
                          className="bubble-image"
                          alt=""
                        />
                      )}

                      {msg.text && (
                        <div className="bubble-text">{msg.text}</div>
                      )}

                      <div className="bubble-meta">
                        <span>{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>

                    {isMe && (
                      <img
                        src={getBubbleAvatar(msg)}
                        className="avatar"
                        alt=""
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* INPUT */}
          <div className="chat-input-area">
            <label className="file-upload-btn">
              📎
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>

            <input
              type="text"
              className="chat-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                usingAdminMode
                  ? isPatient
                    ? t.inputToAdmin
                    : t.inputToUser
                  : t.inputPlaceholder
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  usingAdminMode
                    ? handleSendAdminMessage()
                    : handleSendRoomMessage();
                }
              }}
            />

            <button
              className="chat-send-btn"
              onClick={
                usingAdminMode
                  ? handleSendAdminMessage
                  : handleSendRoomMessage
              }
            >
              ➤
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Chat;
