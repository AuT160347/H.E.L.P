// src/pages/AdminSendEmail.jsx
import { useContext, useEffect, useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { LanguageContext } from "../components/LanguageContext";
import { getCurrentUser } from "../datas/acc";

// ใช้ไฟล์ SERVICE ใหม่!!
import { sendAppointmentEmailToDoctor } from "../utils/emailAppointmentService";

const API_URL = "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";

export default function AdminSendEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { language } = useContext(LanguageContext);

  const [appointment, setAppointment] = useState(
    location.state?.appointment || null
  );
  const [loading, setLoading] = useState(!location.state?.appointment);

  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  /** ตรวจสอบสิทธิ์ผู้ใช้ */
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      Swal.fire("กรุณาเข้าสู่ระบบ", "", "warning");
      navigate("/login");
      return;
    }
    if (user.role !== "admin" && user.role !== "superadmin") {
      Swal.fire("สำหรับแอดมินเท่านั้น", "", "warning");
      navigate("/home");
      return;
    }
  }, []);

  /** โหลดข้อมูลจาก ID ถ้าไม่มี state */
  useEffect(() => {
    if (appointment) {
      prepareEmail(appointment);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setAppointment(res.data);
        prepareEmail(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "ไม่พบข้อมูลการนัดหมาย", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /** เตรียมข้อมูลให้ textarea */
  const prepareEmail = (a) => {
    const patient_fullname = `${a.prefix || ""} ${a.firstName || ""} ${a.lastName || ""}`.trim();

    const symptoms =
      a.symptoms?.trim() ||
      a.symptomsEtc?.trim() ||
      "-";

    const bodyTH = `
อีเมล: ${a.email}
เบอร์โทร: ${a.phoneNumber || a.phone || "-"}

แผนก: ${a.department || "-"}
วันนัดหลัก: ${a.preferredDate || "-"} เวลา ${a.preferredTime || "-"}
วันสำรอง: ${a.backupDate || "-"} เวลา ${a.backupTime || "-"}

อาการเบื้องต้น:
${symptoms}

HN: ${a.hn || a.hospitalNumber || "-"}
เลขบัตร ปชช: ${a.idCard || "-"}

ขอบคุณครับ/ค่ะ
ระบบ H.E.L.P
`.trim();

    setToEmail("doctor@example.com");
    setSubject(`แจ้งนัดหมายคนไข้: ${patient_fullname}`);
    setBody(bodyTH);
  };

  /** ส่งอีเมล */
  const handleSend = async () => {
    if (!toEmail || !toEmail.includes("@")) {
      Swal.fire("Error", "กรุณากรอกอีเมลแพทย์ให้ถูกต้อง", "error");
      return;
    }

    const a = appointment;

    const symptoms =
      a.symptoms?.trim() ||
      a.symptomsEtc?.trim() ||
      "-";

    try {
      await sendAppointmentEmailToDoctor({
        doctor_email: toEmail,
        doctor_name: a.doctor || "แพทย์",

        // patient info
        patient_fullname: `${a.prefix || ""} ${a.firstName || ""} ${a.lastName || ""}`.trim(),
        patient_phone: a.phoneNumber || a.phone || "-",
        patient_email: a.email,

        // appointment
        department: a.department || "-",
        preferredDate: a.preferredDate || "-",
        preferredTime: a.preferredTime || "-",
        backup_date: a.backupDate || "-",
        backup_time: a.backupTime || "-",

        // symptoms
        symptoms,
      });

      // update status
      await axios.put(`${API_URL}/${a.id}`, {
        ...a,
        status: "sent_to_doctor",
      });

      Swal.fire("สำเร็จ", "ส่งอีเมลแจ้งแพทย์เรียบร้อยแล้ว", "success");
      navigate("/admin-doctor");
    } catch (err) {
      console.error(err);
      Swal.fire("เกิดข้อผิดพลาด", "ส่งอีเมลไม่สำเร็จ", "error");
    }
  };

  if (loading || !appointment) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  const patientName = `${appointment.prefix || ""} ${appointment.firstName} ${appointment.lastName}`;

  return (
    <div className="container py-4">
      <Button variant="link" onClick={() => navigate("/admin-doctor")}>
        ← กลับหน้าจัดการนัดหมาย
      </Button>

      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="fw-bold">สร้างอีเมลแจ้งแพทย์</h3>
          <p className="text-muted">สำหรับนัดหมายของ: {patientName}</p>

          <Form>
            {/* email */}
            <Form.Group className="mb-3">
              <Form.Label>อีเมลแพทย์ (To)</Form.Label>
              <Form.Control
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
              />
            </Form.Group>

            {/* subject */}
            <Form.Group className="mb-3">
              <Form.Label>หัวข้อ</Form.Label>
              <Form.Control
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Form.Group>

            {/* body */}
            <Form.Group className="mb-3">
              <Form.Label>ข้อความ</Form.Label>
              <Form.Control
                as="textarea"
                rows={14}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate("/admin-doctor")}>
                ยกเลิก
              </Button>
              <Button variant="primary" onClick={handleSend}>
                ส่งอีเมล
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
