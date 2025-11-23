import { useState, useContext } from "react";
import { Button, Card, Form, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../datas/acc";
import Swal from "sweetalert2";
import { LanguageContext } from "../components/LanguageContext"; 

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
        icon: "warning",
        title: text[language].register.successTitle,
        text: text[language].register.successText,
        confirmButtonText: text[language].ok,
        confirmButtonColor: "#3085d6",
        background: "#fff",
        color: "#333",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: text[language].error,
        text: err.message || text[language].register.errorText,
        confirmButtonText: text[language].ok,
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 shadow-lg border-0 rounded-4">
            <h3 className="text-center mb-4 text-success fw-bold">
              {text[language].register.title}
            </h3>

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
                      <option value="">{text[language].form.selectGender}</option>
                      <option value="ชาย">{text[language].form.male}</option>
                      <option value="หญิง">{text[language].form.female}</option>
                      <option value="อื่น ๆ">{text[language].form.other}</option>
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
                variant="success"
                className="w-100 fw-bold mb-3"
              >
                {text[language].register.submit}
              </Button>

              <div className="text-center">
                <span>{text[language].register.haveAccount}</span>{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => navigate("/login")}
                >
                  {text[language].register.loginLink}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
