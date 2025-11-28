import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { LanguageContext } from "../../components/LanguageContext";
import { getCurrentUser } from "../../datas/acc";

const DOCTOR_API = "https://6913645df34a2ff1170bd0d7.mockapi.io/doctors";

export default function EditDoctorPage() {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const dayList = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // ✅ ฟังก์ชัน normalize schedule ให้เป็น boolean เสมอ
  const normalizeSchedule = (raw) => {
    if (!raw) return {};

    const result = {};
    dayList.forEach((k) => {
      result[k] =
        raw[k] === true ||
        raw[k] === "true" ||
        raw[k] === 1 ||
        raw[k] === "1";
    });

    return result;
  };

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "admin") {
      navigate("/home");
      return;
    }

    if (location.state?.doctor) {
      loadDoctor(location.state.doctor);
      setLoading(false);
    } else {
      loadDoctorFromAPI();
    }
  }, []);

  const loadDoctor = (data) => {
    setDoctor({
      ...data,

      nameTH: data.nameTH || data.name || "",
      nameEN: data.nameEN || data.name || "",

      // ⭐ normalize schedule—สำคัญมาก
      schedule: normalizeSchedule(data.schedule ?? data),
    });
  };

  const loadDoctorFromAPI = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${DOCTOR_API}/${id}`);
      loadDoctor(res.data);
    } catch (err) {
      Swal.fire("Error", "โหลดข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setDoctor((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day) => {
    setDoctor((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: !prev.schedule[day],
      },
    }));
  };

  const saveDoctor = async () => {
    if (!doctor.nameTH || !doctor.nameEN) {
      Swal.fire("แจ้งเตือน", "กรอกชื่อแพทย์ให้ครบ", "warning");
      return;
    }

    const payload = {
      ...doctor,
      name: language === "TH" ? doctor.nameTH : doctor.nameEN,

      // ส่ง schedule กลับแบบ boolean
      schedule: doctor.schedule,

      // inline boolean (เผื่อหน้าอื่นใช้งาน)
      ...doctor.schedule,
    };

    try {
      await axios.put(`${DOCTOR_API}/${doctor.id}`, payload);

      Swal.fire("Success", "บันทึกสำเร็จ", "success").then(() => {
        navigate(`/dashboard/hospitals/${doctor.hospitalId}/doctors`);
      });
    } catch (err) {
      Swal.fire("Error", "บันทึกไม่สำเร็จ", "error");
    }
  };

  if (loading || !doctor) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button
        className="btn btn-light mb-3"
        onClick={() => navigate("/dashboard/hospitals")}
      >
        ← {language === "TH" ? "กลับ" : "Back"}
      </button>
      <h3 className="fw-bold">
        {language === "TH" ? "แก้ไขข้อมูลแพทย์ — " : "Edit Doctor — "}
        {doctor.nameTH || doctor.nameEN}
      </h3>

      <Card className="mt-3 shadow-sm">
        <Card.Body>
          <Row>
            <Col>
              <Form.Label>ชื่อแพทย์ (ไทย)</Form.Label>
              <Form.Control
                value={doctor.nameTH}
                onChange={(e) => updateField("nameTH", e.target.value)}
              />
            </Col>

            <Col>
              <Form.Label>ชื่อแพทย์ (อังกฤษ)</Form.Label>
              <Form.Control
                value={doctor.nameEN}
                onChange={(e) => updateField("nameEN", e.target.value)}
              />
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>แผนก (ไทย)</Form.Label>
            <Form.Control
              value={doctor.departmentTH || ""}
              onChange={(e) => updateField("departmentTH", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>แผนก (อังกฤษ)</Form.Label>
            <Form.Control
              value={doctor.departmentEN || ""}
              onChange={(e) => updateField("departmentEN", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={doctor.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </Form.Group>

          <h5 className="mt-4">วันที่ออกตรวจ</h5>
          <Row>
            {dayList.map((day) => (
              <Col xs={4} md={3} lg={2} key={day} className="mb-2">
                <Form.Check
                  type="checkbox"
                  label={day}
                  checked={doctor.schedule[day] || false}
                  onChange={() => toggleDay(day)}
                />
              </Col>
            ))}
          </Row>

          <div className="text-end mt-4">
            <Button variant="primary" onClick={saveDoctor}>
              {language === "TH" ? "บันทึก" : "Save"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
