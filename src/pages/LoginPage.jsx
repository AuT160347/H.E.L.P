// ✅ src/pages/LoginPage.jsx
import { useState, useContext } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../datas/acc";
import Swal from "sweetalert2";
import { LanguageContext } from "../components/LanguageContext";
import "./loginAndRegister.css";
import doctorIMG from "/img/DocterRemove.png";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { language, text } = useContext(LanguageContext);

  const t = text?.[language] || text?.TH || {};
  const tLogin = t.login || {};
  const tForm = t.form || {};

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(username, password);

      Swal.fire({
        icon: "success",
        title: tLogin.successTitle || "Login Success",
        text: `${tLogin.welcome || "Welcome"} ${user.firstname}`,
        timer: 2000,
        showConfirmButton: false,
      });

      window.dispatchEvent(new Event("userChanged"));

      // ✅ ถ้าเป็น admin → เข้าหน้า dashboard
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        // ถ้าเป็น patient / doctor → ไปหน้า home
        navigate("/home");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: tLogin.errorTitle || "Error",
        text: err.message,
      });
    }
  };

  return (
    <div className="auth-page-bg">
      <div className="auth-shell">
        {/* Left Hero */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <p className="auth-tagline">
              Protect Yourself and Your Family —<br />
              <span>Easy Online Appointments.</span>
            </p>

            <div className="auth-doctor-card">
              <img src={doctorIMG} alt="Doctor" className="auth-doctor-img" />

              <div className="auth-pill auth-pill-top">
                💉 5.7M doses injected
              </div>

              <div className="auth-pill auth-pill-bottom">
                ✅ 98% recovery rate
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="auth-right">
          <button className="auth-back-btn" onClick={() => navigate("/home")}>
            <i className="bi bi-house-door-fill" style={{ fontSize: "22px" }}></i>
          </button>

          <Card className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <span className="auth-logo-icon">+</span>
                <span className="auth-logo-text">H.E.L.P</span>
              </div>

              <div className="auth-toggle">
                <button
                  type="button"
                  className="auth-toggle-btn inactive"
                  onClick={() => navigate("/register")}
                >
                  New Patient
                </button>

                <button className="auth-toggle-btn active">
                  Existing Patient
                </button>
              </div>
            </div>

            <h4 className="auth-title">{tLogin.title || "Login"}</h4>
            <p className="auth-subtitle">Secure, quick, and easy.</p>

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>{tForm.username || "Username"}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={tForm.usernamePh || "Enter username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>{tForm.password || "Password"}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={tForm.passwordPh || "Enter password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                className="auth-primary-btn w-100 fw-bold mb-3"
              >
                {tLogin.submit || "Login"}
              </Button>

              <div className="text-center small">
                <span>{tLogin.noAccount || "No account?"}</span>{" "}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => navigate("/register")}
                >
                  {tLogin.registerLink || "Register"}
                </button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
