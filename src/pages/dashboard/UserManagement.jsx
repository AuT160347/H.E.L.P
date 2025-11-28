import { useEffect, useState, useContext } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { LanguageContext } from "../../components/LanguageContext";
import {
  getUsers,
  verifyUser,
  rejectUser,
  deleteUser,
} from "../../datas/acc";
import "./UserMang.css";
import Swal from "sweetalert2";
import useSuperAdminGuard from "../../hooks/useSuperAdminGuard";

export default function UserManagement() {
  useSuperAdminGuard();

  const { language } = useContext(LanguageContext);

  const [users, setUsers] = useState([]);
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  // Reject Modal State
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      Swal.fire("Error", "Unable to load users", "error");
    }
  };

  // เปิด Modal ปฏิเสธ
  const openReject = (user) => {
    setSelectedUser(user);
    setRejectReason("");
    setRejectModal(true);
  };

  // ยืนยันปฏิเสธ
  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      Swal.fire(
        "Warning",
        language === "TH"
          ? "กรุณากรอกเหตุผลในการปฏิเสธ"
          : "Please enter reject reason",
        "warning"
      );
      return;
    }

    try {
      await rejectUser(selectedUser.id, rejectReason);
      Swal.fire(
        "OK",
        language === "TH"
          ? "ปฏิเสธผู้ใช้งานเรียบร้อย"
          : "User rejected",
        "info"
      );
      setRejectModal(false);
      loadUsers();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const filteredUsers = users.filter((u) =>
    showPendingOnly ? !u.verified && !u.rejected : true
  );

  const calculateAge = (dob) => {
  if (!dob) return "-";
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return "-";

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

  return (
    <div className="user-container">
      <h1 style={{ fontWeight: 700 }}>
        {language === "TH" ? "จัดการผู้ใช้" : "User Management"}
      </h1>

      {/* Toggle Pending Only */}
      <div className="d-flex justify-content-end mb-3">
        <Form.Check
          type="switch"
          checked={showPendingOnly}
          onChange={() => setShowPendingOnly(!showPendingOnly)}
          label={
            showPendingOnly
              ? language === "TH"
                ? "เฉพาะรออนุมัติ"
                : "Pending Only"
              : language === "TH"
              ? "ผู้ใช้ทั้งหมด"
              : "All Users"
          }
        />
      </div>

      {/* Table */}
      <Table bordered hover responsive className="user-table">
        <thead>
          <tr>
            <th>{language === "TH" ? "ลำดับ" : "List"}</th>
            <th>{language === "TH" ? "ชื่อผู้ใช้" : "Username"}</th>
            <th>Email</th>
            <th>{language === "TH" ? "อายุ" : "Age"}</th>
            <th>{language === "TH" ? "สถานะ" : "Status"}</th>
            <th>{language === "TH" ? "จัดการ" : "Actions"}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, i) => (
            <tr key={u.id}>
              <td>{i + 1}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{calculateAge(u.dob)}</td>
              <td>
                {u.verified ? (
                  <span className="text-success fw-bold">
                    {language === "TH" ? "✔ ยืนยันแล้ว" : "✔ Verified"}
                  </span>
                ) : u.rejected ? (
                  <span className="text-danger fw-bold">
                    {language === "TH" ? "❌ ถูกปฏิเสธ" : "❌ Rejected"}
                  </span>
                ) : (
                  <span className="text-warning fw-bold">
                    {language === "TH" ? "⏳ รออนุมัติ" : "⏳ Pending"}
                  </span>
                )}
              </td>

              <td>
                {!u.verified && !u.rejected && (
                  <>
                    <Button
                      size="sm"
                      className="me-2"
                      variant="success"
                      onClick={async () => {
                        await verifyUser(u.id);
                        loadUsers();
                      }}
                    >
                      ✓
                    </Button>

                    <Button
                      size="sm"
                      className="me-2"
                      variant="danger"
                      onClick={() => openReject(u)}
                    >
                      ✕
                    </Button>
                  </>
                )}

                <Button
  size="sm"
  variant="outline-danger"
  className="btn-delete-outline"
  onClick={async () => {
    await deleteUser(u.id);
    loadUsers();
  }}
>
  {language === "TH" ? "ลบ" : "Delete"}
</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Reject Modal */}
      <Modal show={rejectModal} onHide={() => setRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {language === "TH" ? "เหตุผลปฏิเสธ" : "Reject Reason"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRejectModal(false)}>
            {language === "TH" ? "ยกเลิก" : "Cancel"}
          </Button>

          <Button variant="danger" onClick={confirmReject}>
            {language === "TH" ? "ปฏิเสธ" : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
