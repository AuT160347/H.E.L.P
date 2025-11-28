// src/pages/History.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Badge, Card, Modal, Button } from "react-bootstrap";
import { getCurrentUser } from "../datas/acc";

import {
  Calendar3,
  Clock,
  Hospital,
  PersonBadge,
  PersonVcard,
  FileEarmarkCheck,
  ClipboardCheck,
  XCircle
} from "react-bootstrap-icons";

import { LanguageContext } from "../components/LanguageContext";
import { useNavigate } from "react-router-dom";

import "./Appointment.css";

const API_URL =
  "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";

const History = () => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);

  const { language, text } = useContext(LanguageContext);
  const t = text[language].history;
  const navigate = useNavigate();

  const loadData = async () => {
    const user = getCurrentUser();
    if (!user) return;

    try {
      const res = await axios.get(API_URL);
      const filtered = res.data.filter(
        (item) => item.user === user.username
      );
      setList(filtered.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ❌ Cancel Appointment
  const cancelAppointment = async (id) => {
    if (
      !window.confirm(
        language === "TH"
          ? "ต้องการยกเลิกนัดหมายหรือไม่?"
          : "Do you want to cancel this appointment?"
      )
    )
      return;

    try {
      await axios.put(`${API_URL}/${id}`, {
        status: "cancelled",
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // 🏷 ดึงสถานะแบบรองรับ 2 ภาษา
  const getStatusLabel = (status) => {
    return t.status[status] || "-";
  };

  const statusColor = {
    pending: "warning",
    confirmed: "primary",
    sent_to_hospital: "success",
    cancelled: "danger",
  };

  return (
    <div className="appointment-bg">
      <div className="appointment-container">

        <div className="appointment-header">
          <h1 className="appointment-title">{t.title}</h1>
        </div>

        {list.length === 0 && (
          <p className="text-center text-muted">{t.empty}</p>
        )}

        {/* ================== รายการนัดหมาย ================== */}
        {list.map((item) => (
          <Card
            key={item.id}
            className="summary-card mb-4 p-3"
            style={{ maxWidth: "900px", margin: "0 auto" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="m-0">
                {item.preferredDate}{" "}
                {language === "TH" ? "เวลา" : "at"} {item.preferredTime}
              </h5>

              <Badge bg={statusColor[item.status] || "secondary"}>
                {getStatusLabel(item.status)}
              </Badge>
            </div>

            <div className="review-sec mt-3">
              <div className="review-row">
                <span><Hospital /> {t.colHospital}</span>
                <strong>{item.hospital}</strong>
              </div>

              <div className="review-row">
                <span><PersonBadge /> {t.colDept}</span>
                <strong>{item.department}</strong>
              </div>

              <div className="review-row">
                <span><PersonVcard /> {t.colDoctor}</span>
                <strong>
                  {item.doctor ||
                    (language === "TH" ? "ให้ระบบเลือกให้" : "Auto-assigned")}
                </strong>
              </div>

              <div className="review-row">
                <span><ClipboardCheck /> {t.colStatus}</span>
                <strong style={{ color: "#4E46E5" }}>
                  {getStatusLabel(item.status)}
                </strong>
              </div>
            </div>

            {/* ปุ่ม Action */}
            <div className="d-flex gap-2 mt-3">
              <Button
                variant="outline-primary"
                onClick={() => {
                  setSelected(item);
                  setShow(true);
                }}
              >
                <ClipboardCheck /> {language === "TH" ? "ดูรายละเอียด" : "Details"}
              </Button>

              {item.status !== "cancelled" && (
                <Button
                  variant="outline-danger"
                  onClick={() => cancelAppointment(item.id)}
                >
                  <XCircle /> {language === "TH" ? "ยกเลิกนัดหมาย" : "Cancel"}
                </Button>
              )}
            </div>
          </Card>
        ))}

        {/* ================== Modal ================== */}
        <Modal show={show} onHide={() => setShow(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {language === "TH"
                ? "รายละเอียดการนัดหมาย"
                : "Appointment Details"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selected && (
              <>
                <h5
                  className="mb-4"
                  style={{
                    padding: "12px 16px",
                    background: "#f4f4ff",
                    borderRadius: "10px",
                    fontWeight: 600,
                  }}
                >
                  {selected.preferredDate}{" "}
                  {language === "TH" ? "เวลา" : "at"} {selected.preferredTime}
                </h5>

                {/* Appointment Info */}
                <div className="review-sec mb-4">
                  <h5 className="fw-bold mb-3" style={{ color: "#4E46E5" }}>
                    {language === "TH" ? "ข้อมูลการนัดหมาย" : "Appointment Info"}
                  </h5>

                  <div className="review-row">
                    <span><Hospital /> {t.colHospital}</span>
                    <strong>{selected.hospital}</strong>
                  </div>

                  <div className="review-row">
                    <span><PersonBadge /> {t.colDept}</span>
                    <strong>{selected.department}</strong>
                  </div>

                  <div className="review-row">
                    <span><PersonVcard /> {t.colDoctor}</span>
                    <strong>{selected.doctor || "-"}</strong>
                  </div>

                  <div className="review-row">
                    <span><ClipboardCheck /> {t.colStatus}</span>
                    <strong style={{ color: "#4E46E5" }}>
                      {getStatusLabel(selected.status)}
                    </strong>
                  </div>
                </div>

                {/* Patient Info */}
                <h5 className="fw-bold mb-2" style={{ color: "#4E46E5" }}>
                  {text[language].step3.patientInfo}
                </h5>
                <div className="review-sec">

                  <div className="review-row">
                    <span>{text[language].step3.name}</span>
                    <strong>
                      {selected.prefix} {selected.firstName}{" "}
                      {selected.lastName}
                    </strong>
                  </div>

                  <div className="review-row">
                    <span>{text[language].step3.phone}</span>
                    <strong>{selected.phone || selected.phoneNumber}</strong>
                  </div>

                  <div className="review-row">
                    <span>{text[language].step3.email}</span>
                    <strong>{selected.email}</strong>
                  </div>

                  <div className="review-row">
                    <span>{text[language].step3.symptoms}</span>
                    <strong>{selected.symptoms}</strong>
                  </div>

                  {selected.medicalFileName && (
                    <div className="review-row">
                      <span><FileEarmarkCheck /> {text[language].step3.viewMedic}</span>
                      <strong className="text-success">
                        {selected.medicalFileName}
                      </strong>
                    </div>
                  )}
                </div>
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              {language === "TH" ? "ปิด" : "Close"}
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
};

export default History;
