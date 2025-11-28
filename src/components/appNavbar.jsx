// src/components/AppNavbar.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Bell, PersonCircle } from "react-bootstrap-icons";
import { LanguageContext } from "./LanguageContext";
import styled from "styled-components";
import { getCurrentUser } from "../datas/acc";
import axios from "axios";
import { createPortal } from "react-dom";

import "./addNavbar.css";
import logo from "/public/logohelp.png";

// API URLs
const USER_API = "https://691205be52a60f10c8205121.mockapi.io/Users";
const APPOINT_API = "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";

const StyledWrapper = styled.div``;

/* ----------------------------- ICONS ----------------------------- */
function homeIcon() { return <svg width="26" height="26" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.53 20.79 21.04 20.41 21.41C20.04 21.79 19.53 22 19 22H5C4.47 22 3.96 21.79 3.59 21.41C3.21 21.04 3 20.53 3 20V9Z" /></svg>; }
function chatIcon() { return <svg width="26" height="26" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 11.5C21 17 16 20 12.5 20C9 20 8 19 3 21L4.9 15.3C3 11 4 7 8 4C10 3 12 3 13 3C17.5 3 21 7 21 11.5Z" /></svg>; }
function searchIcon() { return <svg width="26" height="26" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeWidth="1.5" d="M10.5 19C15.2 19 19 15.2 19 10.5C19 5.8 15.2 2 10.5 2S2 5.8 2 10.5 5.8 19 10.5 19z" /><path strokeWidth="1.5" d="M22 22L17 17" /></svg>; }
function appointmentIcon() { return <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" d="M8 7V3M16 7V3M3 11H21" /><path strokeWidth="1.5" d="M5 21H19C20.1 21 21 20.1 21 19V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V19C3 20.1 3.9 21 5 21Z" /></svg>; }
function historyIcon() { return <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" d="M12 8V12L15 15" /><path strokeWidth="1.5" d="M12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22z" /></svg>; }
function manageIcon() { return <svg width="26" height="26" stroke="currentColor" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" strokeWidth="1.5" /><path strokeWidth="1.5" d="M4 9H20" /></svg>; }
function emailIcon() { return <svg width="26" height="26" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeWidth="1.5" d="M4 4L12 10L20 4V20H4V4Z" /></svg>; }


const parseAppointmentDate = (raw) => {
  if (!raw) return null;

  let [datePart] = raw.split(" ");
  let timePart = raw.split("เวลา")[1]?.trim();

  if (!timePart) {
    return new Date(datePart);
  }

  const iso = `${datePart}T${timePart}:00`;

  const d = new Date(iso);
  return isNaN(d) ? null : d;
};


const AppNavbar = () => {
  const { language, toggleLanguage, text } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [notifyCount, setNotifyCount] = useState(0);
  const [notifyList, setNotifyList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const dropdownRef = useRef(null);

  /* ---------------- LOAD ROLE ---------------- */
  useEffect(() => {
    const loadRole = async () => {
      const user = getCurrentUser();
      if (!user) return;

      try {
        const res = await axios.get(`${USER_API}/${user.id}`);
        setRole(res.data.role || "patient");
        fetchNotification(res.data.role, user.username);
      } catch {
        setRole("patient");
      }
    };

    loadRole();
    window.addEventListener("userChanged", loadRole);
    return () => window.removeEventListener("userChanged", loadRole);
  }, []);

  //* -------------------------------------------------------------- */
  /*             ⭐⭐⭐  NOTIFICATION (BELL) – ONLY UPDATED ⭐⭐⭐         */
  /* -------------------------------------------------------------- */
  const fetchNotification = async (role, username) => {
    try {
      const res = await axios.get(APPOINT_API);
      const apps = res.data || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const THREE_DAYS = 3 * 86400000;

      // สถานะที่แจ้งเตือนได้
      const allowStatus = ["confirmed", "sent_to_hospital", "approved"];

      const filtered = apps.filter((a) => {

        if (!allowStatus.includes(a.status)) return false;

        const d1 = parseAppointmentDate(a.preferredDate);
        const d2 = parseAppointmentDate(a.backupDate);

        let diff = null;
        let target = null;

        if (d1) {
          diff = d1 - today;
          target = d1;
        } else if (d2) {
          diff = d2 - today;
          target = d2;
        }

        if (diff === null) return false;
        if (diff < 0 || diff > THREE_DAYS) return false;

        if (role === "patient") return a.user === username;
        if (role === "doctor") return true;

        return false;
      });



      setNotifyCount(filtered.length);
      setNotifyList(filtered);
    } catch (err) {

    }
  };


  /* ---------------- PROFILE ---------------- */
  const handleProfileClick = () => {
    const user = getCurrentUser();
    if (!user) return navigate("/login");
    setProfileOpen((prev) => !prev);
  };

  // close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        !e.target.closest(".profile-dropdown")
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- MENU ---------------- */
  const menuItems =
    text?.[language]?.navbar?.[role] ??
    text?.[language]?.navbar?.patient ??
    [];

  const iconMap = {
    "หน้าแรก": homeIcon(),
    Home: homeIcon(),
    "แชท": chatIcon(),
    Chat: chatIcon(),
    "ค้นหา": searchIcon(),
    Search: searchIcon(),
    "จองนัด": appointmentIcon(),
    Appointment: appointmentIcon(),
    "ประวัติ": historyIcon(),
    History: historyIcon(),
    "จัดการนัดหมาย": manageIcon(),
    "Manage Appointment": manageIcon(),
    "ส่งอีเมล": emailIcon(),
    "Send Email": emailIcon(),
  };

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm px-3 navbar-fix-overflow">
        <Container fluid>
          <Navbar.Brand>
            <img src={logo} alt="logo" style={{ width: "67px", height: "50px" }} />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center">
              {/* MENU */}
              <div className="flex flex-col">
                <div className="py-3 flex gap-1 rounded-md">
                  {menuItems.map((item, i) => (
                    <Link key={i} to={item.path} className="group relative px-3 cursor-pointer">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:text-blue-500">
                        {iconMap[item.name] ?? "?"}
                      </div>
                      <span className="nav-tooltip">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* LANGUAGE */}
              <Nav.Link onClick={toggleLanguage} className="me-3">
                {language === "TH" ? "TH" : "EN"}
              </Nav.Link>

              {/* BELL ICON */}
              {/* 🔔 BELL */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ cursor: "pointer", position: "relative", marginRight: "15px" }}
              >
                <Bell size={22} className={`text-secondary ${notifyCount > 0 ? "bell-shake" : ""}`} />

                {notifyCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-3px",
                      right: "-3px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "10px",
                    }}
                  >
                    {notifyCount}
                  </span>
                )}
              </div>


              {/* PROFILE */}
              <div ref={profileRef} style={{ cursor: "pointer", position: "relative" }} onClick={handleProfileClick}>
                <PersonCircle size={24} className="text-dark" />

                {profileOpen && getCurrentUser() && (
                  <div
                    className="profile-dropdown"
                    style={{
                      position: "absolute",
                      top: "35px",
                      right: "0",
                      background: "white",
                      width: "170px",
                      height: "140px",
                      borderRadius: "13px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      zIndex: 9999,
                      overflow: "hidden",
                    }}
                  >
                    <StyledWrapper>
                      <div className="card">
                        <br />
                        <div className="separator" />
                        <ul className="list">
                          <li className="element" onClick={() => navigate("/profile")}>
                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#7e8590" strokeWidth={2}>
                              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="currentColor" d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" />
                            </svg>
                            <p className="label">{language === "TH" ? "ดูโปรไฟล์" : "Profile"}</p>
                          </li>

                          <li className="element delete" onClick={() => {
                            localStorage.removeItem("user");
                            navigate("/login");
                          }}>
                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#bec3caff" strokeWidth={1.5}>
                              <path clipRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" fillRule="evenodd" />
                            </svg>
                            <p className="label">{language === "TH" ? "ล็อคเอ้าท์" : "Logout"}</p>
                          </li>
                        </ul>
                        <div className="separator" />
                      </div>
                    </StyledWrapper>
                  </div>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {dropdownOpen &&
        createPortal(
          <div
            className="notify-dropdown-anim"
            style={{
              position: "fixed",
              top: "65px",
              right: "25px",
              background: "white",
              borderRadius: "10px",
              width: "260px",
              padding: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              zIndex: 999999,
            }}
          >
            <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
              <i class="bi bi-calendar-event-fill"></i> {language === "TH" ? "นัดของคุณวันนี้" : "Your Appointments"}
            </h6>

            {notifyList.length === 0 ? (
              <div style={{ opacity: 0.6 }}>
                {language === "TH" ? "ไม่มีนัดใน 3 วันถัดไป" : "No appointments in next 3 days"}
              </div>
            ) : (
              <ul style={{ paddingLeft: "20px" }}>
                {notifyList.map((a) => (
                  <li key={a.id} style={{ marginBottom: "6px" }}>
                    <strong>{a.preferredDate}</strong>
                    <br />
                    {language === "TH" ? "เวลา" : "Time"}: {a.preferredTime}
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.body
        )}

    </>
  );
};

export default AppNavbar;
