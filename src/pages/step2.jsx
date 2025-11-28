// src/pages/step2.jsx
import { useContext, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { LanguageContext } from "../components/LanguageContext";
import {
  PersonVcard,
  Calendar3,
  Phone,
  Envelope,
  CreditCard,
  CardChecklist,
} from "react-bootstrap-icons";
import { getCurrentUser } from "../datas/acc";

const Step2 = ({ formData, setFormData, next, prev }) => {
  const { language, text } = useContext(LanguageContext);
  const t = text[language].step2;

  useEffect(() => {
    if (!formData.bookingFor) {
      const u = getCurrentUser();
      setFormData((prev) => ({
        ...prev,
        bookingFor: "self",
        prefix: prev.prefix || "",
        firstName: u?.firstname || "",
        lastName: u?.lastname || "",
        dob: u?.dob || "",
        gender: u?.gender || "",
        phone: u?.phone || "",
        email: u?.email || "",
      }));
    }
  }, []);

  const handleModeChange = (e) => {
    const mode = e.target.value;

    if (mode === "self") {
      const u = getCurrentUser();
      setFormData((prev) => ({
        ...prev,
        bookingFor: "self",
        prefix: prev.prefix || "",
        firstName: u?.firstname || "",
        lastName: u?.lastname || "",
        dob: u?.dob || "",
        gender: u?.gender || "",
        phone: u?.phone || "",
        email: u?.email || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        bookingFor: "other",
        prefix: "",
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        idCard: "",
        hn: "",
        symptoms: "",
        medicalFileData: "",
        medicalFileName: "",
      }));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024)
      return alert(language === "TH" ? "ไฟล์ต้องไม่เกิน 3MB" : "File must not exceed 3MB");

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        medicalFileData: reader.result,
        medicalFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="step-card">

      <h4 className="step-title">{t.header}</h4>

      <div className="booking-mode-wrapper">

        <div
          className={`booking-mode-card ${formData.bookingFor === "self" ? "active" : ""}`}
          onClick={() => handleModeChange({ target: { value: "self" } })}
        >
          <input type="radio" name="bookingFor" value="self" checked={formData.bookingFor === "self"} readOnly />
          <span>{t.self}</span>
        </div>

        <div
          className={`booking-mode-card ${formData.bookingFor === "other" ? "active" : ""}`}
          onClick={() => handleModeChange({ target: { value: "other" } })}
        >
          <input type="radio" name="bookingFor" value="other" checked={formData.bookingFor === "other"} readOnly />
          <span>{t.other}</span>
        </div>

      </div>

      <Row className="g-3 mt-3">

        <Col md={4}>
          <Form.Label>{t.prefix}</Form.Label>
          <div className="input-icon">
            <PersonVcard className="input-icon-left" />
            <Form.Select name="prefix" value={formData.prefix} onChange={handleChange}>
              <option value="">{t.prefix}</option>
              <option value={t.mr}>{t.mr}</option>
              <option value={t.mrs}>{t.mrs}</option>
              <option value={t.ms}>{t.ms}</option>
            </Form.Select>
          </div>
        </Col>

        <Col md={4}>
          <Form.Label>{t.firstname}</Form.Label>
          <div className="input-icon">
            <PersonVcard className="input-icon-left" />
            <Form.Control
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={formData.bookingFor === "self"}
            />
          </div>
        </Col>

        <Col md={4}>
          <Form.Label>{t.lastname}</Form.Label>
          <div className="input-icon">
            <PersonVcard className="input-icon-left" />
            <Form.Control
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={formData.bookingFor === "self"}
            />
          </div>
        </Col>

        <Col md={4}>
          <Form.Label>{t.dob}</Form.Label>
          <div className="input-icon">
            <Calendar3 className="input-icon-left" />
            <Form.Control
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={formData.bookingFor === "self"}
            />
          </div>
        </Col>

        <Col md={4}>
          <Form.Label>{t.gender}</Form.Label>
          <div className="input-icon">
            <PersonVcard className="input-icon-left" />
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">{t.gender}</option>
              <option value={t.male}>{t.male}</option>
              <option value={t.female}>{t.female}</option>
            </Form.Select>
          </div>
        </Col>

        <Col md={4}>
          <Form.Label>{t.phone}</Form.Label>
          <div className="input-icon">
            <Phone className="input-icon-left" />
            <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
          </div>
        </Col>

        <Col md={4}>
          <Form.Label>{t.email}</Form.Label>
          <div className="input-icon">
            <Envelope className="input-icon-left" />
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={formData.bookingFor === "self"}
            />
          </div>
        </Col>

        <Col md={4}>
          <Form.Label>{t.idCard}</Form.Label>
          <div className="input-icon">
            <CreditCard className="input-icon-left" />
            <Form.Control name="idCard" value={formData.idCard} onChange={handleChange} />
          </div>
        </Col>

        <Col md={4}>
          <Form.Label>{t.hn}</Form.Label>
          <div className="input-icon">
            <CardChecklist className="input-icon-left" />
            <Form.Control name="hn" value={formData.hn} onChange={handleChange} />
          </div>
        </Col>

        <Col md={12}>
          <Form.Label>{t.symptomsHeader}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
          />
        </Col>

        <Col md={12}>
          <Form.Label>{t.uploadHeader}</Form.Label>
          <Form.Control type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />

          {formData.medicalFileName && (
            <div className="text-success small mt-1">
              ✓ {formData.medicalFileName}
            </div>
          )}
        </Col>

      </Row>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn-modern-alt" onClick={prev}>{t.back}</button>
        <button className="btn-modern" onClick={next}>{t.next}</button>
      </div>
    </div>
  );
};

export default Step2;
