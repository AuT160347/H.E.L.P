import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  HouseFill,
  CalendarCheck,
  PersonCheckFill,
  HospitalFill,
  GearFill,
  BoxArrowRight,
  ListUl,
  PersonPlusFill,
} from "react-bootstrap-icons";

import { useContext } from "react";
import { LanguageContext } from "../components/LanguageContext";

import "./adminLayout.css";
import logo from "/public/logohelp.png";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const menu = [
    {
      label: language === "TH" ? "แผงควบคุม" : "Dashboard",
      icon: <HouseFill size={18} />,
      path: "/dashboard",
    },
    {
      label: language === "TH" ? "จัดการนัดหมาย" : "Manage Appointment",
      icon: <CalendarCheck size={18} />,
      path: "/dashboard/manage-appointment",
    },
    {
      label: language === "TH" ? "อนุมัติผู้ใช้" : "Approve User",
      icon: <PersonCheckFill size={18} />,
      path: "/dashboard/users",
    },
    {
      label: language === "TH" ? "รายชื่อโรงพยาบาล" : "Hospital List",
      icon: <ListUl size={18} />,
      path: "/dashboard/hospitals",
    },
    {
      label: language === "TH" ? "เพิ่มโรงพยาบาล" : "Add Hospital",
      icon: <HospitalFill size={18} />,
      path: "/dashboard/hospitals/add",
    },

    {
      label: language === "TH" ? "เพิ่มแพทย์" : "Add Doctor",
      icon: <PersonPlusFill size={18} />,
      path: "/dashboard/add-doctor",
    },
  ];

  const bottomMenu = [
    {
      label: language === "TH" ? "ตั้งค่า" : "Settings",
      icon: <GearFill size={18} />,
      path: "/dashboard/settings",
    },
    {
      label: language === "TH" ? "ออกจากระบบ" : "Logout",
      icon: <BoxArrowRight size={18} />,
      action: () => {
        localStorage.removeItem("user");
        navigate("/login");
      },
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} className="logo-img" />
          <h5>{language === "TH" ? "แผงควบคุมผู้ดูแล" : "Admin Dashboard"}</h5>
        </div>

        <nav className="sidebar-menu">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {bottomMenu.map((item) =>
            item.action ? (
              <div key={item.label} className="menu-item" onClick={item.action}>
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item ${
                  isActive(item.path) ? "active" : ""
                }`}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          )}
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
