// ✅ src/pages/ProfilePage.jsx — Hybrid Paolo UI + Edit + Change Password
import { useEffect, useState, useContext } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { LanguageContext } from "../components/LanguageContext";
import { getCurrentUser, logoutUser } from "../datas/acc";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const { language, text } = useContext(LanguageContext);
  const t = text[language];

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modes
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Edit data
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    gender: "",
  });

  // Change password
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");

  // Load user
  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      navigate("/login");
      return;
    }

    setUser(current);
    setFormData({
      firstname: current.firstname || "",
      lastname: current.lastname || "",
      email: current.email || "",
      dob: current.dob || "",
      gender: current.gender || "",
    });

    setLoading(false);
  }, []);

  // On change edit fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile
  const handleSaveChanges = async () => {
    try {
      const updated = { ...user, ...formData };

      const res = await fetch(
        `https://691205be52a60f10c8205121.mockapi.io/Users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );

      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setIsEditing(false);

      Swal.fire("Success", "ข้อมูลได้รับการบันทึกแล้ว", "success");
    } catch {
      Swal.fire("Error", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  // Save password change
  const handleSavePassword = async () => {
    if (oldPass !== user.password) {
      Swal.fire("ผิดพลาด", "รหัสผ่านเดิมไม่ถูกต้อง", "error");
      return;
    }
    if (newPass.length < 6) {
      Swal.fire("ผิดพลาด", "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร", "error");
      return;
    }
    if (newPass !== confirmNewPass) {
      Swal.fire("ผิดพลาด", "รหัสผ่านใหม่ไม่ตรงกัน", "error");
      return;
    }

    try {
      const updated = { ...user, password: newPass };

      const res = await fetch(
        `https://691205be52a60f10c8205121.mockapi.io/Users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );

      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setIsChangingPass(false);
      setOldPass("");
      setNewPass("");
      setConfirmNewPass("");

      Swal.fire("สำเร็จ", "เปลี่ยนรหัสผ่านสำเร็จ", "success");
    } catch {
      Swal.fire("Error", "เกิดข้อผิดพลาด กรุณาลองใหม่", "error");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: language === "TH" ? "ออกจากระบบ?" : "Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: language === "TH" ? "ออกจากระบบ" : "Logout",
      cancelButtonText: language === "TH" ? "ยกเลิก" : "Cancel",
    }).then((res) => {
      if (res.isConfirmed) {
        logoutUser();
        navigate("/login");
      }
    });
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );

  // ================================
  // 🎨 UI START (Hybrid Paolo)
  // ================================
  return (
    <div className="profile-bg-container">
      <h1 className="profile-title">{t.profile?.title || "โปรไฟล์"}</h1>

      <Card className="profile-card shadow-lg border-0">
        {/* ================= NORMAL VIEW ================= */}
        {!isEditing && !isChangingPass && (
          <>
            {/* HEADER */}
            <div className="profile-header">
              <div className="profile-avatar">
                <i className="bi bi-person-fill" />
              </div>
              <div className="profile-header-text">
                <h3>
                  {user.firstname} {user.lastname}
                </h3>
                <span className="profile-username">{user.username}</span>
              </div>
            </div>

            {/* DETAIL GRID */}
            <div className="profile-detail-grid">
              <div className="profile-detail-col">
                <div className="profile-row">
                  <span className="label">{language === "TH" ? "ชื่อ" : "First Name"}</span>
                  <span className="value">{user.firstname}</span>
                </div>
                <div className="profile-row">
                  <span className="label">{language === "TH" ? "นามสกุล" : "Last Name"}</span>
                  <span className="value">{user.lastname}</span>
                </div>
                <div className="profile-row">
                  <span className="label">Email</span>
                  <span className="value">{user.email}</span>
                </div>
              </div>

              <div className="profile-detail-col">
                <div className="profile-row">
                  <span className="label">{language === "TH" ? "วันเกิด" : "Birthday"}</span>
                  <span className="value">{user.dob || "-"}</span>
                </div>
                <div className="profile-row">
                  <span className="label">{language === "TH" ? "เพศ" : "Gender"}</span>
                  <span className="value">{user.gender || "-"}</span>
                </div>
              </div>
            </div>

            {/* BUTTONS — LEFT 2 + RIGHT 1 */}
            <div className="profile-actions">
              <div className="profile-actions-left">
              </div>
              <div className="profile-actions-right">
                
                <Button className="profile-btn primary" onClick={() => setIsEditing(true)}>
                  <i className="bi bi-pencil-square" />{" "}
                  {language === "TH" ? "แก้ไขข้อมูล" : "Edit Profile"}
                </Button>
                <Button
                  className="profile-btn info mt-3"
                  onClick={() => setIsChangingPass(true)}
                >
                  <i className="bi bi-shield-lock-fill" />{" "}
                  {language === "TH" ? "เปลี่ยนรหัสผ่าน" : "Change Password"}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* ================= EDIT PROFILE MODE ================= */}
        {isEditing && (
          <>
            <h4 className="section-title">{language === "TH" ? "แก้ไขข้อมูลส่วนตัว" : "Edit Profile"}</h4>

            <Form.Group className="mb-2">
              <Form.Label>{language === "TH" ? "ชื่อ" : "First Name"}</Form.Label>
              <Form.Control name="firstname" value={formData.firstname} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>{language === "TH" ? "นามสกุล" : "Last Name"}</Form.Label>
              <Form.Control name="lastname" value={formData.lastname} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>{language === "TH" ? "วันเกิด" : "Birthday"}</Form.Label>
              <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{language === "TH" ? "เพศ" : "Gender"}</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="ชาย">{language === "TH" ? "ชาย" : "Male"}</option>
                <option value="หญิง">{language === "TH" ? "หญิง" : "Female"}</option>
                <option value="อื่น ๆ">{language === "TH" ? "อื่น ๆ" : "Other"}</option>
              </Form.Select>
            </Form.Group>

            <Button className="w-100 mt-2" onClick={handleSaveChanges}>
              {language === "TH" ? "บันทึกข้อมูล" : "Save"}
            </Button>

            <Button
              variant="outline-secondary"
              className="w-100 mt-2"
              onClick={() => setIsEditing(false)}
            >
              {language === "TH" ? "ยกเลิก" : "Cancel"}
            </Button>
          </>
        )}

        {/* ================= CHANGE PASSWORD MODE ================= */}
        {isChangingPass && (
          <>
            <h4 className="section-title">{language === "TH" ? "เปลี่ยนรหัสผ่าน" : "Change Password"}</h4>

            <Form.Group className="mb-3">
              <Form.Label>{language === "TH" ? "รหัสผ่านเดิม" : "Current Password"}</Form.Label>
              <Form.Control type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{language === "TH" ? "รหัสผ่านใหม่" : "New Password"}</Form.Label>
              <Form.Control type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{language === "TH" ? "ยืนยันรหัสผ่านใหม่" : "Confirm New Password"}</Form.Label>
              <Form.Control type="password" value={confirmNewPass} onChange={(e) => setConfirmNewPass(e.target.value)} />
            </Form.Group>

            <Button className="w-100 mt-2" onClick={handleSavePassword}>
              {language === "TH" ? "บันทึกรหัสผ่านใหม่" : "Save New Password"}
            </Button>

            <Button
              variant="outline-secondary"
              className="w-100 mt-2"
              onClick={() => setIsChangingPass(false)}
            >
              {language === "TH" ? "ยกเลิก" : "Cancel"}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default ProfilePage;
