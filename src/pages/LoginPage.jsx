import { useState, useContext } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../datas/acc";
import Swal from "sweetalert2";
import { LanguageContext } from "../components/LanguageContext";
import "../App.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { language, text } = useContext(LanguageContext);

  // ✅ เรียกใช้ Context
  const t = text?.[language] || text?.TH || {};
  const tLogin = t.login || {};
  const tForm = t.form || {};

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(username, password);
      Swal.fire({
        icon: "success",
        title: tLogin.successTitle,
        text: `${tLogin.welcome} ${user.firstname}`,
        timer: 2000,
        showConfirmButton: false,
      });

      window.dispatchEvent(new Event("userChanged"));
      navigate("/home");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: tLogin.errorTitle || "Error",
        text: err.message,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc, #e2e8f0)" }}>
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-4 text-primary fw-bold">{tLogin.title}</h3>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>{tForm.username}</Form.Label>
            <Form.Control type="text" placeholder={tForm.usernamePh} value={username}
              onChange={(e) => setUsername(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>{tForm.password}</Form.Label>
            <Form.Control type="password" placeholder={tForm.passwordPh} value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100 fw-bold mb-3">{tLogin.submit}</Button>
          <div className="text-center">
            <span>{tLogin.noAccount}</span>{" "}
            <Button variant="link" className="p-0" onClick={() => navigate("/register")}>{tLogin.registerLink}</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;