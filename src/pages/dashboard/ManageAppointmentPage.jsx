import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ManageAppointmentPage.css";

import { Modal, Button, Form } from "react-bootstrap";
import {
  PinMap,
  Envelope,
  CheckCircle,
  SendFill
} from "react-bootstrap-icons";

import { LanguageContext } from "../../components/LanguageContext";
import { sendAppointmentEmailToDoctor } from "../../utils/emailAppointmentService";

const API_URL =
  "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";

const HOSPITAL_API =
  "https://691205be52a60f10c8205121.mockapi.io/hospital";

const ManageAppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [tab, setTab] = useState("pending");

  const { language } = useContext(LanguageContext);

  // 🔥 ฟิลเตอร์ในแท็บ Done
  const [doneFilter, setDoneFilter] = useState("success"); 
  // success = sent_to_hospital, cancelled = cancelled

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
    appointment: null,
  });

  const loadData = async () => {
    const res = await axios.get(API_URL);
    setAppointments(res.data.reverse());

    const h = await axios.get(HOSPITAL_API);
    setHospitals(h.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getHospitalEmail = (hospitalName) => {
    const found = hospitals.find(
      (h) => h.hospitalNameTH?.trim() === hospitalName?.trim()
    );
    return found?.email || "";
  };

  // ✔ Approve
  const approve = async (id) => {
    await axios.put(`${API_URL}/${id}`, { status: "approved" });
    loadData();
  };

  // ✔ Cancel
  const cancel = async (id) => {
    await axios.put(`${API_URL}/${id}`, { status: "cancelled" });
    loadData();
  };

  // ✔ Open Modal
  const openEmailModal = (item) => {
    const hospitalEmail = getHospitalEmail(item.hospital);

    const body = `
${language === "TH" ? "เรียนฝ่ายประสานงานโรงพยาบาล" : "Dear Hospital Coordination Team"} ${item.hospital}

${language === "TH"
        ? "มีผู้ป่วยต้องการนัดหมายเข้ารับการตรวจ ดังรายละเอียดต่อไปนี้"
        : "A patient has requested an appointment. Details below:"}

${language === "TH" ? "ชื่อผู้ป่วย" : "Patient"}: ${item.prefix} ${item.firstName} ${item.lastName}
${language === "TH" ? "เบอร์โทร" : "Phone"}: ${item.phone}
Email: ${item.email}

${language === "TH" ? "แผนก" : "Department"}: ${item.department}
${language === "TH" ? "แพทย์" : "Doctor"}: ${item.doctor || "-"}

${language === "TH" ? "วันนัดหลัก" : "Preferred Date"}: ${item.preferredDate} ${item.preferredTime}
${language === "TH" ? "วันสำรอง" : "Backup Date"}: ${item.backupDate} ${item.backupTime}

${language === "TH" ? "อาการเบื้องต้น" : "Symptoms"}:
${item.symptoms || "-"}
    `.trim();

    setEmailData({
      to: hospitalEmail || "",
      subject:
        language === "TH"
          ? `แจ้งนัดหมายผู้ป่วย: ${item.firstName} ${item.lastName}`
          : `Patient Appointment: ${item.firstName} ${item.lastName}`,
      body,
      appointment: item,
    });

    setShowModal(true);
  };

  // ✔ Update Modal Inputs
  const handleChangeEmail = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  // ✔ Send Email
  const confirmSendEmail = async () => {
    try {
      const ap = emailData.appointment;

      await sendAppointmentEmailToDoctor({
        doctor_email: emailData.to,
        subject: emailData.subject,
        message: emailData.body,

        patient_fullname: `${ap.prefix} ${ap.firstName} ${ap.lastName}`,
        patient_phone: ap.phone,
        patient_email: ap.email,
        department: ap.department,
        preferred_date: ap.preferredDate,
        preferred_time: ap.preferredTime,
        backup_date: ap.backupDate,
        backup_time: ap.backupTime,
        symptoms: ap.symptoms
      });

      await axios.put(`${API_URL}/${ap.id}`, {
        status: "sent_to_hospital",
      });

      setShowModal(false);
      loadData();

      alert(language === "TH" ? "ส่งข้อมูลเรียบร้อยแล้ว!" : "Email sent!");
    } catch (error) {
      alert(language === "TH" ? "ส่งเมลไม่สำเร็จ" : "Email failed");
    }
  };

  // 🔥 ฟิลเตอร์หลัก
  const filtered =
    tab === "pending"
      ? appointments.filter((a) => a.status === "pending")
      : tab === "approved"
      ? appointments.filter((a) => a.status === "approved")
      : // 🔥 ฟิลเตอร์ในแท็บ DONE
        appointments.filter((a) =>
          doneFilter === "success"
            ? a.status === "sent_to_hospital"
            : a.status === "cancelled"
        );

  return (
    <div className="manage-container">
      <h1 className="page-title">
        {language === "TH" ? "จัดการการนัดหมาย" : "Appointment Management"}
      </h1>

      {/* Tabs */}
      <div className="tab-buttons">
        <button
          className={tab === "pending" ? "tab active" : "tab"}
          onClick={() => setTab("pending")}
        >
          <PinMap /> {language === "TH" ? "นัดหมายใหม่" : "New Requests"}
        </button>

        <button
          className={tab === "approved" ? "tab active" : "tab"}
          onClick={() => setTab("approved")}
        >
          <Envelope /> {language === "TH" ? "รอส่งเมล" : "Pending Email"}
        </button>

        <button
          className={tab === "done" ? "tab active" : "tab"}
          onClick={() => setTab("done")}
        >
          <CheckCircle /> {language === "TH" ? "ส่งแล้ว / ยกเลิก" : "Sent / Cancelled"}
        </button>
      </div>

      {/* 🔥 Filter buttons for DONE tab */}
      {tab === "done" && (
        <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
          <button
            className={
              doneFilter === "success"
                ? "btn btn-success"
                : "btn btn-outline-success"
            }
            onClick={() => setDoneFilter("success")}
          >
            {language === "TH" ? "ส่งสำเร็จ" : "Sent"}
          </button>

          <button
            className={
              doneFilter === "cancelled"
                ? "btn btn-danger"
                : "btn btn-outline-danger"
            }
            onClick={() => setDoneFilter("cancelled")}
          >
            {language === "TH" ? "ยกเลิก" : "Cancelled"}
          </button>
        </div>
      )}

      {/* Table */}
      <table className="table table-hover modern-table mt-3">
        <thead>
          <tr>
            <th>{language === "TH" ? "ผู้ป่วย" : "Patient"}</th>
            <th>{language === "TH" ? "โรงพยาบาล" : "Hospital"}</th>
            <th>{language === "TH" ? "แผนก" : "Department"}</th>
            <th>{language === "TH" ? "วันนัด" : "Date"}</th>
            <th>{language === "TH" ? "เวลา" : "Time"}</th>
            <th className="text-end">{language === "TH" ? "จัดการ" : "Actions"}</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td>{item.firstName} {item.lastName}</td>
              <td>{item.hospital}</td>
              <td>{item.department}</td>
              <td>{item.preferredDate}</td>
              <td>{item.preferredTime}</td>

              <td className="text-end">
                {tab === "pending" && (
                  <>
                    <button className="btn btn-outline-success btn-sm me-2"
                      onClick={() => approve(item.id)}
                    >
                      {language === "TH" ? "อนุมัติ" : "Approve"}
                    </button>

                    <button className="btn btn-outline-danger btn-sm"
                      onClick={() => cancel(item.id)}
                    >
                      {language === "TH" ? "ยกเลิก" : "Cancel"}
                    </button>
                  </>
                )}

                {tab === "approved" && (
                  <>
                    <button className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => openEmailModal(item)}
                    >
                      {language === "TH" ? "ส่งไป รพ." : "Send Email"}
                    </button>

                    <button className="btn btn-outline-danger btn-sm"
                      onClick={() => cancel(item.id)}
                    >
                      {language === "TH" ? "ยกเลิก" : "Cancel"}
                    </button>
                  </>
                )}

                {tab === "done" && (
                  <span
                    className={
                      item.status === "sent_to_hospital"
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }
                    style={{ width: "110px" }}
                  >
                    {item.status === "sent_to_hospital"
                      ? language === "TH" ? "ส่งสำเร็จ" : "Sent"
                      : language === "TH" ? "ยกเลิก" : "Cancelled"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {language === "TH" ? "แก้ไขอีเมลก่อนส่ง" : "Edit Email Before Sending"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{language === "TH" ? "ส่งถึง" : "Send To"}</Form.Label>
              <Form.Control
                name="to"
                type="email"
                value={emailData.to}
                onChange={handleChangeEmail}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{language === "TH" ? "หัวข้อ" : "Subject"}</Form.Label>
              <Form.Control
                name="subject"
                value={emailData.subject}
                onChange={handleChangeEmail}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{language === "TH" ? "ข้อความ" : "Message"}</Form.Label>
              <Form.Control
                as="textarea"
                rows={12}
                name="body"
                value={emailData.body}
                onChange={handleChangeEmail}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            {language === "TH" ? "ปิด" : "Close"}
          </Button>

          <Button variant="outline-primary" onClick={confirmSendEmail} style={{ height:"48px" }}>
            <SendFill />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageAppointmentPage;
