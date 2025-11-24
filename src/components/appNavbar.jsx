import React, { useContext, useEffect, useState, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Bell, PersonCircle } from "react-bootstrap-icons";
import { LanguageContext } from "./LanguageContext";
import styled from "styled-components";
import { getCurrentUser } from "../datas/acc";
import axios from "axios";
import { createPortal } from "react-dom";

import "./addNavbar.css";
import logo from "/public/logohelp.png";

const USER_API = "https://691205be52a60f10c8205121.mockapi.io/Users";
const APPOINT_API = "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";

const StyledWrapper = styled.div`
  button {
    position: relative;
    display: inline-block;
    margin: 1px;
    padding: 9px 10px;
    text-align: center;
    font-size: 18px;
    color: #2e2352ff;
    background: transparent;
    border: 1px solid #725ac1;
    border-radius: 9px;
    transition: 0.4s;
  }
  button:hover {
    background: #725ac1;
    color: white;
  }
`;

const AppNavbar = () => {
  const { language, toggleLanguage, text } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [notifyCount, setNotifyCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState([]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = getCurrentUser();
      if (!user) return;

      try {
        const res = await axios.get(`${USER_API}/${user.id}`);
        const userRole = res.data.role || "patient";
        setRole(userRole);

        fetchTodayNotify(userRole, user.username);
      } catch {
        setRole("patient");
      }
    };

    fetchUserRole();
    window.addEventListener("userChanged", fetchUserRole);
    return () => window.removeEventListener("userChanged", fetchUserRole);
  }, []);

  // ⭐ FIX: โหลดแจ้งเตือนหลัง role เปลี่ยน (หลัง login)
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;
    fetchTodayNotify(role, user.username);
  }, [role]);

  const fetchTodayNotify = async (role, username) => {
    try {
      const res = await axios.get(APPOINT_API);
      const apps = res.data || [];

      const today = new Date().toLocaleDateString("sv-SE");


      const filtered = apps.filter((a) => {
        const date1 = a.preferredDate?.slice(0, 10);
        const date2 = a.backupDate?.slice(0, 10);
        const isToday = date1 === today || date2 === today;

        if (!isToday) return false;
        if (a.status !== "confirmed") return false;

        if (role === "patient") return a.user === username;
        if (role === "doctor") return isToday && a.status === "confirmed";


        return false;
      });

      setNotifyCount(filtered.length);
      setTodayAppointments(filtered);
    } catch (err) {
      console.log("notify error:", err);
    }
  };

  const toggleDropdown = () => {
    if (role === "admin") return;
    setDropdownOpen(!dropdownOpen);
  };

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleUserClick = () => {
    const user = getCurrentUser();
    if (user) navigate("/profile");
    else navigate("/login");
  };

  const menuItems = text[language].navbar[role];

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm px-3 navbar-fix-overflow">
        <Container fluid>
          <Navbar.Brand>
            <img src={logo} alt="logo" style={{ width: "67px", height: "50px" }} />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center">

              <StyledWrapper className="d-flex gap-2">
                {menuItems.map((item, idx) => (
                  <Link key={idx} to={item.path}>
                    <button>{item.name}</button>
                  </Link>
                ))}
              </StyledWrapper>

              <Nav.Link onClick={toggleLanguage}>
                {language === "TH" ? "TH" : "EN"}
              </Nav.Link>

              {/* Bell */}
              <div
                onClick={toggleDropdown}
                style={{ cursor: "pointer", position: "relative", marginRight: "15px" }}
              >
                <Bell size={22} className={`text-secondary ${notifyCount > 0 ? "bell-shake" : ""}`} />

                {notifyCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-3px",
                      right: "-3px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "10px",
                    }}
                  >
                    {notifyCount}
                  </span>
                )}
              </div>

              <Nav.Link onClick={handleUserClick}>
                <PersonCircle size={22} className="text-dark" />
              </Nav.Link>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Portal dropdown */}
      {dropdownOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="notify-dropdown-anim"
            style={{
              position: "fixed",
              top: "65px",
              right: "25px",
              background: "white",
              borderRadius: "10px",
              width: "260px",
              padding: "12px",
              boxShadow: "0px 2px 12px rgba(0,0,0,0.2)",
              zIndex: 999999,
            }}
          >
            <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
              {role === "patient"
                ? text[language].bell.todayPatient
                : `${text[language].bell.todayDoctor} (${notifyCount})`}
            </h6>


            {todayAppointments.length === 0 ? (
              <div style={{ opacity: 0.6 }}>ไม่มีนัดวันนี้</div>
            ) : (
              <ul style={{ paddingLeft: "20px" }}>
                {todayAppointments.map((a) => (
                  <li key={a.id} style={{ marginBottom: "6px" }}>
                    {role === "patient" ? (
                      <>
                        <strong>หมอ:</strong> {a.doctor} <br />
                        เวลา: {a.preferredTime}
                      </>
                    ) : (
                      <>
                        <strong>{a.firstName} {a.lastName}</strong> ({a.preferredTime})
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export default AppNavbar;
