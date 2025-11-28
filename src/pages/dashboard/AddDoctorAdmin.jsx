import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { LanguageContext } from "../../components/LanguageContext";

// Doctor API
const DOCTOR_API = "https://6913645df34a2ff1170bd0d7.mockapi.io/doctors";

// Hospital API
const HOSPITAL_API = "https://691205be52a60f10c8205121.mockapi.io/hospital";

export default function AddDoctorAdmin() {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  const [doctor, setDoctor] = useState({
    hospitalId: "",
    hospital: "",
    nameTH: "",
    nameEN: "",
    email: "",
    image: "",
    departmentTH: "",
    departmentEN: "",
    schedule: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });

  const dayLabelTH = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
  const dayLabelEN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const scheduleKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Load hospitals
  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      const res = await axios.get(HOSPITAL_API);
      setHospitals(res.data);
    } catch (err) {
      Swal.fire("Error", "โหลดรายชื่อโรงพยาบาลไม่สำเร็จ", "error");
    } finally {
      setLoadingHospitals(false);
    }
  };

  const handleHospitalSelect = (id) => {
    const selected = hospitals.find((h) => h.id === id);
    setDoctor({
      ...doctor,
      hospitalId: id,
      hospital:
        language === "TH" ? selected.hospitalNameTH : selected.hospitalNameEN,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor.hospitalId)
      return Swal.fire("แจ้งเตือน", "กรุณาเลือกโรงพยาบาล", "warning");

    if (!doctor.nameTH || !doctor.nameEN)
      return Swal.fire(
        "แจ้งเตือน",
        "กรุณากรอกชื่อแพทย์ (ไทย/อังกฤษ)",
        "warning"
      );

    if (!doctor.departmentTH || !doctor.departmentEN)
      return Swal.fire(
        "แจ้งเตือน",
        "กรุณากรอกแผนก (ไทย/อังกฤษ)",
        "warning"
      );

    const nameDisplay = language === "TH" ? doctor.nameTH : doctor.nameEN;

    const payload = {
      ...doctor,
      name: nameDisplay,
    };

    try {
      await axios.post(DOCTOR_API, payload);
      Swal.fire("สำเร็จ", "เพิ่มแพทย์สำเร็จ", "success");
      navigate(`/dashboard/hospitals/${doctor.hospitalId}/doctors`);
    } catch (err) {
      Swal.fire("Error", "ไม่สามารถเพิ่มแพทย์ได้", "error");
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h2 className="fw-bold mb-4">
        {language === "TH" ? "เพิ่มแพทย์" : "Add Doctor"}
      </h2>

      <Card className="shadow-sm border-0" style={{ borderRadius: "16px" }}>
        <Card.Body className="p-4">
          {/* ================== HOSPITAL ================== */}
          <h5 className="fw-bold mb-3">
            {language === "TH" ? "ข้อมูลโรงพยาบาล" : "Hospital"}
          </h5>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              {language === "TH" ? "เลือกโรงพยาบาล" : "Select Hospital"}
            </Form.Label>

            <Form.Select
              value={doctor.hospitalId}
              onChange={(e) => handleHospitalSelect(e.target.value)}
            >
              <option value="">
                {language === "TH"
                  ? "— เลือกโรงพยาบาล —"
                  : "— Select Hospital —"}
              </option>

              {!loadingHospitals &&
                hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {language === "TH"
                      ? h.hospitalNameTH
                      : h.hospitalNameEN}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          {/* ================== NAME ================== */}
          <h5 className="fw-bold mb-3">
            {language === "TH" ? "ข้อมูลแพทย์" : "Doctor Info"}
          </h5>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{language === "TH" ? "ชื่อ (TH)" : "Name (TH)"}</Form.Label>
                <Form.Control
                  value={doctor.nameTH}
                  onChange={(e) =>
                    setDoctor({ ...doctor, nameTH: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{language === "TH" ? "ชื่อ (EN)" : "Name (EN)"}</Form.Label>
                <Form.Control
                  value={doctor.nameEN}
                  onChange={(e) =>
                    setDoctor({ ...doctor, nameEN: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ================== DEPARTMENT ================== */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {language === "TH" ? "แผนก (TH)" : "Department (TH)"}
                </Form.Label>
                <Form.Control
                  value={doctor.departmentTH}
                  onChange={(e) =>
                    setDoctor({ ...doctor, departmentTH: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {language === "TH" ? "แผนก (EN)" : "Department (EN)"}
                </Form.Label>
                <Form.Control
                  value={doctor.departmentEN}
                  onChange={(e) =>
                    setDoctor({ ...doctor, departmentEN: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ================== EMAIL ================== */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{language === "TH" ? "อีเมล":"Email"}</Form.Label>
                <Form.Control
                  value={doctor.email}
                  onChange={(e) =>
                    setDoctor({ ...doctor, email: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* ================== SCHEDULE ================== */}
          <h5 className="fw-bold mt-4 mb-3">
            {language === "TH" ? "วันออกตรวจ" : "Inspection Day"}
          </h5>

          <Row>
            {scheduleKeys.map((day, idx) => (
              <Col xs={6} md={4} key={day} className="mb-2">
                <Form.Check
                  type="checkbox"
                  label={language === "TH" ? dayLabelTH[idx] : dayLabelEN[idx]}
                  checked={doctor.schedule[day]}
                  onChange={(e) =>
                    setDoctor({
                      ...doctor,
                      schedule: {
                        ...doctor.schedule,
                        [day]: e.target.checked,
                      },
                    })
                  }
                />
              </Col>
            ))}
          </Row>

          <div className="text-end mt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              style={{ borderRadius: "12px", padding: "10px 28px" }}
            >
              {language === "TH" ? "เพิ่มแพทย์" : "Add Doctor"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
