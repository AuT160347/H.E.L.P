import { useState, useContext } from "react";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../datas/acc";
import Swal from "sweetalert2";
import { LanguageContext } from "../components/LanguageContext";
import "./loginAndRegister.css";

import doctorIMG from "/img/DocterRemove.png"


function RegisterPage() {
  const navigate = useNavigate();
  const { language, text } = useContext(LanguageContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    dob: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      Swal.fire({
        icon: "success",
        title: text[language].register.successTitle,
        text: text[language].register.successText,
        confirmButtonText: text[language].ok,
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: text[language].error,
        text: err.message || text[language].register.errorText,
      });
    }
  };

  return (
    <div className="auth-page-bg">
      <div className="auth-shell">
        {/* ซ้าย */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <p className="auth-tagline">
              ยินดีต้อนรับสมาชิกสู่เว็บไซต์จองคิว <br />
              <span>Welcome To Website</span>
            </p>

            <div className="auth-doctor-card">
              <img
                src={doctorIMG}
                alt="Doctor"
                className="auth-doctor-img"
              />
              <div className="auth-pill auth-pill-top">
                💙 Trusted by thousands of patients
              </div>
              <div className="auth-pill auth-pill-bottom">
                ⭐ 4.9 / 5 satisfaction
              </div>
            </div>
          </div>
        </div>

        {/* ขวา */}
        <div className="auth-right">

          <button className="auth-back-btn" onClick={() => navigate("/home")}>
          <i className="bi bi-house-door-fill" style={{ fontSize: "22px" }}></i>
        </button>

          <Card className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <span className="auth-logo-icon">+</span>
                <span className="auth-logo-text">MyHHub</span>
              </div>

              <div className="auth-toggle">
                <button className="auth-toggle-btn active">
                  New Patient
                </button>
                <button
                  className="auth-toggle-btn inactive"
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Existing Patient
                </button>
              </div>
            </div>

            <h4 className="auth-title">
              {text[language].register.title}
            </h4>
            <p className="auth-subtitle">
              Create your account in just a few steps.
            </p>

            <Form onSubmit={handleRegister}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{text[language].form.firstname}</Form.Label>
                    <Form.Control
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder={text[language].form.firstnamePh}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{text[language].form.lastname}</Form.Label>
                    <Form.Control
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder={text[language].form.lastnamePh}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>{text[language].form.email}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={text[language].form.emailPh}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{text[language].form.dob}</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{text[language].form.gender}</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">
                        {text[language].form.selectGender}
                      </option>
                      <option value="ชาย">{text[language].form.male}</option>
                      <option value="หญิง">
                        {text[language].form.female}
                      </option>
                      <option value="อื่น ๆ">
                        {text[language].form.other}
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{text[language].form.username}</Form.Label>
                    <Form.Control
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder={text[language].form.usernamePh}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>{text[language].form.password}</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={text[language].form.passwordPh}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                className="auth-primary-btn w-100 fw-bold mb-3"
              >
                {text[language].register.submit}
              </Button>

              <div className="text-center small">
                <span>{text[language].register.haveAccount}</span>{" "}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => navigate("/login")}
                >
                  {text[language].register.loginLink}
                </button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
