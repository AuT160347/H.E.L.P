import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../components/LanguageContext";
import { getCurrentUser } from "../../datas/acc";

const HOSPITAL_API = "https://691205be52a60f10c8205121.mockapi.io/hospital";

export default function AddHospitalPage() {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [hospital, setHospital] = useState({
    hospitalNameTH: "",
    hospitalNameEN: "",
    hospitalIMG: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "admin") navigate("/home");
  }, []);

  const toBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!hospital.hospitalNameTH || !hospital.hospitalNameEN) {
      Swal.fire("แจ้งเตือน", "กรุณากรอกชื่อโรงพยาบาล (TH/EN)", "warning");
      return;
    }

    try {
      Swal.showLoading();

      await axios.post(HOSPITAL_API, {
        ...hospital,
        createdAt: new Date().toISOString(),
      });

      Swal.fire("สำเร็จ", "เพิ่มโรงพยาบาลสำเร็จ", "success");

      navigate("/dashboard/hospitals");
    } catch (err) {
      Swal.fire("ERROR", "ไม่สามารถเพิ่มข้อมูลได้", "error");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2 className="fw-bold">
          {language === "TH" ? "เพิ่มโรงพยาบาล" : "Add Hospital"}
        </h2>

        <Button variant="light" onClick={() => navigate("/dashboard/hospitals")}>
          ← {language === "TH" ? "กลับ" : "Back"}
        </Button>
      </div>

      <Card className="p-4 shadow-sm">
        <Form.Group>
          <Form.Label>{language==="TH"?"ชื่อโรงพยาบาล":"Hospital Name"} (TH)</Form.Label>
          <Form.Control
            value={hospital.hospitalNameTH}
            onChange={(e) => setHospital({ ...hospital, hospitalNameTH: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>{language==="TH"?"ชื่อโรงพยาบาล":"Hospital Name"}  (EN)</Form.Label>
          <Form.Control
            value={hospital.hospitalNameEN}
            onChange={(e) => setHospital({ ...hospital, hospitalNameEN: e.target.value })}
          />
        </Form.Group>

        <Row className="mt-3">
          <Col>
          <Form.Label>{language==="TH"?"อีเมล":"Email"}</Form.Label>
            <Form.Control
              value={hospital.email}
              onChange={(e) => setHospital({ ...hospital, email: e.target.value })}
            />
          </Col>
          <Col>
            <Form.Label>{language==="TH"?"เบอร์โทร":"Phone Number"}</Form.Label>
            <Form.Control
              value={hospital.phone}
              onChange={(e) => setHospital({ ...hospital, phone: e.target.value })}
            />
          </Col>
        </Row>

        <Form.Group className="mt-3">
          <Form.Label>{language==="TH"?"รูปโรงพยาบาล":"Hospital Logo"}</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] &&
              toBase64(e.target.files[0], (b64) =>
                setHospital({ ...hospital, hospitalIMG: b64 })
              )
            }
          />

          {hospital.hospitalIMG && (
            <img
              src={hospital.hospitalIMG}
              className="mt-3"
              style={{
                maxWidth: 400,
                width: "100%",
                borderRadius: 12,
                border: "1px solid #ccc",
              }}
            />
          )}
        </Form.Group>

        <div className="text-end mt-4">
          <Button size="lg" onClick={handleSubmit}>
            {language === "TH" ? "บันทึก" : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
