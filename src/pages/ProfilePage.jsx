// ✅ src/pages/ProfilePage.jsx
import { useEffect, useState, useContext } from "react";
import { Button, Card, Table, Form, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getCurrentUser,
  logoutUser,
  getUsers,
  verifyUser,
  rejectUser,
  deleteUser,
} from "../datas/acc";
import { LanguageContext } from "../components/LanguageContext";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหมดแก้ไขโปรไฟล์ของ user/doctor
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    gender: "",
  });

  // Modal สำหรับปฏิเสธผู้ใช้ (แอดมิน)
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRejectUser, setSelectedRejectUser] = useState(null);

  // ปุ่มสวิทช์: แสดงเฉพาะผู้ใช้ที่ยังไม่อนุมัติ
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  // เปิด modal ปฏิเสธ
  const openRejectModal = (u) => {
    setSelectedRejectUser(u);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // คำนวณอายุจากวันเกิด
  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      navigate("/login");
      return;
    }
    setUser(current);

    if (current.role === "admin") {
      loadUsers();
    } else {
      setFormData({
        firstname: current.firstname || "",
        lastname: current.lastname || "",
        email: current.email || "",
        dob: current.dob || "",
        gender: current.gender || "",
      });
      setLoading(false);
    }
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: language === "TH" ? "เกิดข้อผิดพลาด!" : "Error!",
        text:
          language === "TH"
            ? "ไม่สามารถโหลดข้อมูลผู้ใช้ได้"
            : "Unable to load user data",
      });
      console.error(err);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: language === "TH" ? "ออกจากระบบ?" : "Log out?",
      text:
        language === "TH"
          ? "คุณต้องการออกจากระบบหรือไม่?"
          : "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: language === "TH" ? "ออกจากระบบ" : "Log out",
      cancelButtonText: language === "TH" ? "ยกเลิก" : "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser();
        window.dispatchEvent(new Event("userChanged"));
        navigate("/login");
      }
    });
  };

  const handleVerify = async (id) => {
    try {
      const updatedUser = await verifyUser(id);
      Swal.fire({
        icon: "success",
        title:
          language === "TH"
            ? "ยืนยันผู้ใช้สำเร็จ!"
            : "User verified successfully!",
        html:
          language === "TH"
            ? `<b>${updatedUser.username}</b> ได้รับการอนุมัติเรียบร้อยแล้ว 🎉`
            : `<b>${updatedUser.username}</b> has been approved 🎉`,
      });
      await loadUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: language === "TH" ? "เกิดข้อผิดพลาด" : "Error",
        text: err.message,
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title:
        language === "TH" ? "ลบผู้ใช้นี้หรือไม่?" : "Delete this user?",
      text:
        language === "TH"
          ? "คุณไม่สามารถกู้คืนข้อมูลได้หลังจากลบ"
          : "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: language === "TH" ? "ลบ" : "Delete",
      cancelButtonText: language === "TH" ? "ยกเลิก" : "Cancel",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deleteUser(id);
        Swal.fire({
          icon: "success",
          title:
            language === "TH"
              ? "ลบผู้ใช้สำเร็จ"
              : "User deleted successfully",
        });
        await loadUsers();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: language === "TH" ? "เกิดข้อผิดพลาด" : "Error",
          text:
            language === "TH"
              ? "ไม่สามารถลบผู้ใช้ได้"
              : "Unable to delete user",
        });
      }
    });
  };

  // ยืนยันปฏิเสธผู้ใช้ (กดใน Modal)
  const submitReject = async () => {
    if (!rejectReason.trim()) {
      Swal.fire({
        icon: "warning",
        title:
          language === "TH"
            ? "กรุณาระบุสาเหตุ"
            : "Please enter a reason",
      });
      return;
    }

    try {
      const updated = await rejectUser(selectedRejectUser.id, rejectReason);

      Swal.fire({
        icon: "info",
        title:
          language === "TH"
            ? "ปฏิเสธผู้ใช้เรียบร้อย"
            : "User has been rejected",
        html:
          language === "TH"
            ? `<b>${updated.username}</b> ถูกปฏิเสธ<br>สาเหตุ: ${rejectReason}`
            : `<b>${updated.username}</b> has been rejected<br>Reason: ${rejectReason}`,
      });

      setShowRejectModal(false);
      await loadUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: language === "TH" ? "เกิดข้อผิดพลาด" : "Error",
        text:
          language === "TH"
            ? "ไม่สามารถปฏิเสธผู้ใช้ได้"
            : "Unable to reject user",
      });
    }
  };

  // toggle แก้ไขโปรไฟล์ user/doctor
  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch(
        `https://691205be52a60f10c8205121.mockapi.io/Users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title:
          language === "TH"
            ? "บันทึกข้อมูลสำเร็จ!"
            : "Profile updated successfully!",
        text:
          language === "TH"
            ? "ข้อมูลของคุณถูกอัปเดตเรียบร้อยแล้ว"
            : "Your information has been updated.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: language === "TH" ? "เกิดข้อผิดพลาด" : "Error",
        text:
          language === "TH"
            ? "ไม่สามารถบันทึกข้อมูลได้"
            : "Unable to save changes.",
      });
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>{language === "TH" ? "กำลังโหลดข้อมูล..." : "Loading data..."}</p>
      </div>
    );

  if (!user) return null;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card
        className="shadow-lg"
        style={{
          width: user.role === "admin" ? "65rem" : "40rem",
          padding: "1.5rem",
          borderRadius: "1rem",
        }}
      >
        <h3 className="text-center mb-3 fw-bold">
          {user.role === "admin"
            ? language === "TH"
              ? "จัดการบัญชีผู้ใช้"
              : "Manage Users"
            : language === "TH"
            ? "โปรไฟล์ของฉัน"
            : "My Profile"}
        </h3>

        {/* ------------------------- ADMIN VIEW ----------------------------- */}
        {user.role === "admin" ? (
          <>
            {/* สวิทช์แสดงเฉพาะผู้ใช้ที่รออนุมัติ */}
            <div className="d-flex justify-content-end mb-3">
              <Form.Check
                type="switch"
                id="pending-only-switch"
                label={
                  showPendingOnly
                    ? language === "TH"
                      ? "แสดงเฉพาะผู้ใช้ที่รออนุมัติ"
                      : "Showing only pending users"
                    : language === "TH"
                    ? "แสดงผู้ใช้ทั้งหมด"
                    : "Show all users"
                }
                checked={showPendingOnly}
                onChange={() => setShowPendingOnly((prev) => !prev)}
              />
            </div>

            <Table striped bordered hover responsive>
              <thead>
                <tr className="text-center">
                  <th>#</th>
                  <th>{language === "TH" ? "ชื่อผู้ใช้" : "Username"}</th>
                  <th>{language === "TH" ? "อีเมล" : "Email"}</th>
                  <th>{language === "TH" ? "สถานะ" : "Status"}</th>
                  <th>{language === "TH" ? "วันยืนยัน" : "Verified at"}</th>
                  <th>{language === "TH" ? "อายุ" : "Age"}</th>
                  <th>{language === "TH" ? "การจัดการ" : "Actions"}</th>
                </tr>
              </thead>

              <tbody>
                {users
                  .filter((u) =>
                    showPendingOnly ? !u.verified && !u.rejected : true
                  )
                  .map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>

                      <td className="text-center">
                        {u.verified ? (
                          <span className="text-success fw-bold">
                            {language === "TH"
                              ? " ยืนยันแล้ว"
                              : " Verified"}
                          </span>
                        ) : u.rejected ? (
                          <span className="text-danger fw-bold">
                            {language === "TH"
                              ? "ถูกปฏิเสธ"
                              : "Rejected"}
                          </span>
                        ) : (
                          <span className="text-warning fw-bold">
                            {language === "TH"
                              ? " รอพิจารณา"
                              : " Pending"}
                          </span>
                        )}
                      </td>

                      <td className="text-center">{u.verifiedAt || "-"}</td>
                      <td className="text-center">{calculateAge(u.dob)}</td>

                      <td className="text-center">
                        {!u.verified && !u.rejected && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              className="me-2"
                              onClick={() => handleVerify(u.id)}
                            >
                              {language === "TH" ? "อนุมัติ" : "Approve"}
                            </Button>

                            <Button
                              size="sm"
                              variant="danger"
                              className="me-2"
                              onClick={() => openRejectModal(u)}
                            >
                              {language === "TH" ? " ไม่รับ" : " Reject"}
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(u.id)}
                        >
                          {language === "TH" ? "ลบ" : "Delete"}
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </>
        ) : (
          /* ------------------------- USER / DOCTOR VIEW ----------------------------- */
          <>
            {isEditing ? (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>
                    {language === "TH" ? "ชื่อ" : "First name"}
                  </Form.Label>
                  <Form.Control
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>
                    {language === "TH" ? "นามสกุล" : "Last name"}
                  </Form.Label>
                  <Form.Control
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>
                    {language === "TH" ? "อีเมล" : "Email"}
                  </Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>
                    {language === "TH" ? "วันเกิด" : "Date of birth"}
                  </Form.Label>
                  <Form.Control
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {language === "TH" ? "เพศ" : "Gender"}
                  </Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">
                      {language === "TH" ? "เลือกเพศ" : "Select gender"}
                    </option>
                    <option value="ชาย">
                      {language === "TH" ? "ชาย" : "Male"}
                    </option>
                    <option value="หญิง">
                      {language === "TH" ? "หญิง" : "Female"}
                    </option>
                    <option value="อื่น ๆ">
                      {language === "TH" ? "อื่น ๆ" : "Other"}
                    </option>
                  </Form.Select>
                </Form.Group>

                <Button
                  variant="success"
                  className="w-100 mb-2"
                  onClick={handleSaveChanges}
                >
                  {language === "TH"
                    ? "บันทึกการแก้ไข"
                    : "Save Changes"}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={handleEditToggle}
                >
                  {language === "TH" ? "ยกเลิก" : "Cancel"}
                </Button>
              </>
            ) : (
              <>
                <p>
                  <b>{language === "TH" ? "ชื่อผู้ใช้:" : "Username:"}</b>{" "}
                  {user.username}
                </p>
                <p>
                  <b>{language === "TH" ? "ชื่อจริง:" : "Full name:"}</b>{" "}
                  {user.firstname} {user.lastname}
                </p>
                <p>
                  <b>{language === "TH" ? "อีเมล:" : "Email:"}</b>{" "}
                  {user.email}
                </p>
                <p>
                  <b>{language === "TH" ? "วันเกิด:" : "Birthday:"}</b>{" "}
                  {user.dob}
                </p>
                <p>
                  <b>{language === "TH" ? "เพศ:" : "Gender:"}</b>{" "}
                  {user.gender}
                </p>
                <p>
                  <b>{language === "TH" ? "สถานะ:" : "Status:"}</b>{" "}
                  {user.verified ? (
                    <span className="text-success">
                      {language === "TH" ? "ยืนยันแล้ว" : "Verified"}
                    </span>
                  ) : user.rejected ? (
                    <span className="text-danger">
                      {language === "TH" ? "ถูกปฏิเสธ" : "Rejected"}
                    </span>
                  ) : (
                    <span className="text-warning">
                      {language === "TH" ? "รอการยืนยัน" : "Pending"}
                    </span>
                  )}
                </p>

                <Button
                  variant="primary"
                  className="w-100 mb-2"
                  onClick={handleEditToggle}
                >
                  {language === "TH"
                    ? "แก้ไขข้อมูล"
                    : "Edit Profile"}
                </Button>
              </>
            )}
          </>
        )}

        <Button
          variant="secondary"
          className="w-100 mt-3"
          onClick={handleLogout}
        >
          {language === "TH" ? "ออกจากระบบ" : "Log out"}
        </Button>
      </Card>

      {/* ---------------------- REJECT MODAL ---------------------- */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {language === "TH"
              ? "ระบุสาเหตุการไม่รับผู้ใช้"
              : "Reason for rejecting user"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <b>{language === "TH" ? "ผู้ใช้:" : "User:"}</b>{" "}
            {selectedRejectUser?.username}
          </p>

          <Form.Group>
            <Form.Label>
              {language === "TH" ? "สาเหตุ:" : "Reason:"}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={
                language === "TH"
                  ? "กรอกเหตุผลที่ต้องการปฏิเสธผู้ใช้..."
                  : "Enter the reason for rejecting this user..."
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRejectModal(false)}
          >
            {language === "TH" ? "ยกเลิก" : "Cancel"}
          </Button>
          <Button variant="danger" onClick={submitReject}>
            {language === "TH"
              ? "ยืนยันการปฏิเสธ"
              : "Confirm Reject"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfilePage;
