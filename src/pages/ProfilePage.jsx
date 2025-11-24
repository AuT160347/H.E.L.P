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

  // pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentUsers = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // แสดงเฉพาะผู้ใช้ที่รออนุมัติ
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  // Modal Reject
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRejectUser, setSelectedRejectUser] = useState(null);

  // AGE function
  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  // ----------------------- LOAD DATA -----------------------
  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      navigate("/login");
      return;
    }
    setUser(current);

    if (current.role === "admin") loadUsers();
    else setLoading(false);
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      Swal.fire("Error", "Cannot load user data", "error");
    }
  };

  // ----------------------- LOGOUT -----------------------
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

  // ----------------------- ADMIN ACTIONS -----------------------
  const handleVerify = async (id) => {
    try {
      await verifyUser(id);
      Swal.fire("Success", "User verified", "success");
      loadUsers();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const openRejectModal = (u) => {
    setSelectedRejectUser(u);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      Swal.fire("Warning", "Please enter reason", "warning");
      return;
    }

    try {
      await rejectUser(selectedRejectUser.id, rejectReason);
      Swal.fire("OK", "User rejected", "info");
      setShowRejectModal(false);
      loadUsers();
    } catch (err) {
      Swal.fire("Error", "Unable to reject user", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "ลบผู้ใช้นี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        await deleteUser(id);
        Swal.fire("Deleted", "User removed", "success");
        loadUsers();
      } catch {
        Swal.fire("Error", "Cannot delete user", "error");
      }
    });
  };

  // ----------------------- USER / DOCTOR EDIT PROFILE -----------------------
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        dob: user.dob || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

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

      Swal.fire("Success", "Profile updated", "success");
    } catch (err) {
      Swal.fire("Error", "Cannot save", "error");
    }
  };

  // ----------------------- RENDER -----------------------

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="d-flex justify-content-center align-items-center bg-light py-4">
      <Card
        className="shadow-lg"
        style={{
          width: user?.role === "admin" ? "65rem" : "40rem",
          padding: "1.5rem",
          borderRadius: "1rem",
        }}
      >
        <h3 className="text-center fw-bold mb-4">
          {user.role === "admin"
            ? language === "TH"
              ? "จัดการบัญชีผู้ใช้"
              : "Manage Users"
            : language === "TH"
              ? "โปรไฟล์ของฉัน"
              : "My Profile"}
        </h3>

        {/* -------------- ADMIN VIEW -------------- */}
        {user.role === "admin" ? (
          <>
            <div className="d-flex justify-content-end mb-3">
              <Form.Check
                type="switch"
                id="pending-only-switch"
                label={
                  showPendingOnly
                    ? language === "TH"
                      ? "เฉพาะรออนุมัติ"
                      : "Pending Only"
                    : language === "TH"
                      ? "ผู้ใช้ทั้งหมด"
                      : "All Users"
                }
                checked={showPendingOnly}
                onChange={() => setShowPendingOnly((p) => !p)}
              />
            </div>

            <div className="admin-table-wrapper">
              <Table striped bordered hover responsive>
                <thead className="text-center">
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Verified At</th>
                    <th>Age</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentUsers
                    .filter((u) =>
                      showPendingOnly ? !u.verified && !u.rejected : true
                    )
                    .map((u, i) => (
                      <tr key={u.id}>
                        <td>{indexOfFirst + i + 1}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>

                        <td className="text-center">
                          {u.verified ? (
                            <span className="text-success fw-bold">Verified</span>
                          ) : u.rejected ? (
                            <span className="text-danger fw-bold">Rejected</span>
                          ) : (
                            <span className="text-warning fw-bold">Pending</span>
                          )}
                        </td>

                        <td className="text-center">{u.verifiedAt || "-"}</td>
                        <td className="text-center">{calculateAge(u.dob)}</td>

                        <td className="text-center">
                          {!u.verified && !u.rejected && (
                            <>
                              <Button
                                size="sm"
                                className="me-2"
                                variant="success"
                                onClick={() => handleVerify(u.id)}
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                className="me-2"
                                variant="danger"
                                onClick={() => openRejectModal(u)}
                              >
                                ✕
                              </Button>
                            </>
                          )}

                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(u.id)}
                          >
                            ลบ
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Form.Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ width: "120px" }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </Form.Select>

              <div>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={currentPage === 1}
                  className="me-2"
                  onClick={() => setCurrentPage((c) => c - 1)}
                >
                  {language === "TH" ? "ก่อนหน้า" : "Previous"}
                </Button>

                <span>
                  หน้า {currentPage} / {totalPages}
                </span>

                <Button
                  size="sm"
                  variant="primary"
                  disabled={currentPage === totalPages}
                  className="ms-2"
                  onClick={() => setCurrentPage((c) => c + 1)}
                >
                  {language === "TH" ? "ถัดไป" : "Next"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* ---------------- USER / DOCTOR PROFILE VIEW ---------------- */
          <>
            {isEditing ? (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>
                    {language === "TH" ? "ชื่อ" : "First Name"}
                  </Form.Label>
                  <Form.Control
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>
                    {language === "TH" ? "นามสกุล" : "Last Name"}
                  </Form.Label>
                  <Form.Control
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>
                    {language === "TH" ? "วันเกิด" : "Birthday"}
                  </Form.Label>
                  <Form.Control
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{language === "TH" ? "เพศ" : "Gender"}</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
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
                  {language === "TH" ? "บันทึกข้อมูล" : "Save"}
                </Button>

                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => setIsEditing(false)}
                >
                  {language === "TH" ? "ยกเลิก" : "Cancel"}
                </Button>
              </>
            ) : (
              <>
                <p>
                  <b>Username:</b> {user.username}
                </p>
                <p>
                  <b>{language === "TH" ? "ชื่อจริง" : "Full name"}:</b>{" "}
                  {user.firstname} {user.lastname}
                </p>
                <p>
                  <b>Email:</b> {user.email}
                </p>
                <p>
                  <b>{language === "TH" ? "วันเกิด" : "Birthday"}:</b>{" "}
                  {user.dob}
                </p>
                <p>
                  <b>{language === "TH" ? "เพศ" : "Gender"}:</b>{" "}
                  {user.gender}
                </p>

                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => setIsEditing(true)}
                >
                  {language === "TH" ? "แก้ไขข้อมูล" : "Edit Profile"}
                </Button>
              </>
            )}
          </>
        )}

        {/* LOGOUT */}
        <Button className="w-100 mt-4" variant="secondary" onClick={handleLogout}>
          {language === "TH" ? "ออกจากระบบ" : "Log out"}
        </Button>
      </Card>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {language === "TH" ? "เหตุผลการปฏิเสธ" : "Reject Reason"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={
              language === "TH" ? "กรอกสาเหตุ..." : "Enter reason..."
            }
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            {language === "TH" ? "ยกเลิก" : "Cancel"}
          </Button>
          <Button variant="danger" onClick={submitReject}>
            {language === "TH" ? "ปฏิเสธ" : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfilePage;
