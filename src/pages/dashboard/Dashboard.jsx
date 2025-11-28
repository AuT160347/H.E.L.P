// src/pages/Admin/Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import { Card, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  PeopleFill,
  CalendarCheckFill,
  HospitalFill,
  Speedometer2,
} from "react-bootstrap-icons";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { LanguageContext } from "../../components/LanguageContext";
import { getCurrentUser } from "../../datas/acc";

// Chart.js Setup
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend
);

// APIs
const USERS_API = "https://691205be52a60f10c8205121.mockapi.io/Users";
const APPOINTMENT_API = "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";
const HOSPITAL_API = "https://691205be52a60f10c8205121.mockapi.io/hospital";
const DOCTOR_API = "https://6913645df34a2ff1170bd0d7.mockapi.io/doctors";

// Month Labels
const LABEL_TH = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const LABEL_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const parseVerifiedDate = (str) => {
  if (!str) return null;
  try {
    const [datePart, timePart] = str.split(" ");
    const [day, month, yearBE] = datePart.split("/");
    const year = parseInt(yearBE) - 543;
    return new Date(`${year}-${month}-${day} ${timePart}`);
  } catch {
    return null;
  }
};

// ⭐ สถานะพร้อมสี
const statusColor = {
  pending: "warning",
  confirmed: "primary",
  sent_to_hospital: "success",
  cancelled: "danger",
};

export default function Dashboard() {
  const { language, text } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [monthlyAppointments, setMonthlyAppointments] = useState([]);
  const [monthlyUsers, setMonthlyUsers] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "admin") {
      navigate("/home");
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [uRes, aRes, hRes, dRes] = await Promise.all([
        axios.get(USERS_API),
        axios.get(APPOINTMENT_API),
        axios.get(HOSPITAL_API),
        axios.get(DOCTOR_API),
      ]);

      const users = uRes.data || [];
      const apps = aRes.data || [];
      const hospitals = hRes.data || [];
      const doctors = dRes.data || [];

      setSummary({
        users: users.length,
        pendingUsers: users.filter((v) => !v.approved && !v.rejected).length,
        hospitals: hospitals.length,
        doctors: doctors.length,
        appointments: apps.length,
      });

      const monthApp = Array(12).fill(0);
      apps.forEach((x) => {
        const d = new Date(x.createdAt || x.preferredDate || x.date);
        if (!isNaN(d)) monthApp[d.getMonth()]++;
      });
      setMonthlyAppointments(monthApp);

      const monthUsers = Array(12).fill(0);
      users.forEach((u) => {
        const d = parseVerifiedDate(u.verifiedAt);
        if (!d || isNaN(d)) return;
        monthUsers[d.getMonth()]++;
      });
      setMonthlyUsers(monthUsers);

      const sorted = [...apps].sort((a, b) => {
        const da = new Date(a.createdAt || a.date);
        const db = new Date(b.createdAt || b.date);
        return db - da;
      });
      setRecentAppointments(sorted.slice(0, 6));
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const labels = language === "TH" ? LABEL_TH : LABEL_EN;

  // ⭐ แปลสถานะตามภาษา
  const getStatusLabel = (status) => {
    if (!text?.[language]?.history?.status) return status;
    return text[language].history.status[status] || status;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: language === "TH" ? "จำนวนการนัดหมาย" : "Appointments",
        data: monthlyAppointments,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.15)",
        tension: 0.4,
      },
      {
        label: language === "TH" ? "ผู้ใช้ที่สมัครรายเดือน" : "New Verified Users",
        data: monthlyUsers,
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.15)",
        tension: 0.4,
      },
    ],
  };

  if (loading)
    return (
      <div style={loadingWrapper}>
        <Spinner />
      </div>
    );

  return (
    <div style={pageWrapper}>
      <h1 style={pageTitle}>
        {language === "TH" ? "แผงควบคุม Admin" : "Admin Dashboard"}
      </h1>

      {/* SUMMARY CARDS */}
      <div style={summaryGrid}>
        <Card style={{ ...summaryCard, borderLeft: "6px solid #725ac1" }}>
          <div>
            <p style={cardLabel}>{language === "TH" ? "ผู้ใช้ทั้งหมด" : "Users"}</p>
            <h2 style={cardValue}>{summary.users}</h2>
            <p style={cardSub}>
              {language === "TH" ? "รออนุมัติ" : "Pending"} {summary.pendingUsers}
            </p>
          </div>
          <div style={iconBox("#725ac1")}>
            <PeopleFill size={28} color="#fff" />
          </div>
        </Card>

        <Card style={{ ...summaryCard, borderLeft: "6px solid #4f8df7" }}>
          <div>
            <p style={cardLabel}>{language === "TH" ? "โรงพยาบาล" : "Hospitals"}</p>
            <h2 style={cardValue}>{summary.hospitals}</h2>
          </div>
          <div style={iconBox("#4f8df7")}>
            <HospitalFill size={28} color="#fff" />
          </div>
        </Card>

        <Card style={{ ...summaryCard, borderLeft: "6px solid #ff8a4c" }}>
          <div>
            <p style={cardLabel}>{language === "TH" ? "แพทย์ทั้งหมด" : "Doctors"}</p>
            <h2 style={cardValue}>{summary.doctors}</h2>
          </div>
          <div style={iconBox("#ff8a4c")}>
            <Speedometer2 size={28} color="#fff" />
          </div>
        </Card>

        <Card style={{ ...summaryCard, borderLeft: "6px solid #3bb273" }}>
          <div>
            <p style={cardLabel}>{language === "TH" ? "การนัดหมาย" : "Appointments"}</p>
            <h2 style={cardValue}>{summary.appointments}</h2>
          </div>
          <div style={iconBox("#3bb273")}>
            <CalendarCheckFill size={28} color="#fff" />
          </div>
        </Card>
      </div>

      {/* CHART */}
      <Card style={chartPanel}>
        <h5 style={panelTitle}>
          {language === "TH"
            ? "เปรียบเทียบผู้ใช้ใหม่ & การนัดหมายรายเดือน"
            : "Monthly New Users & Appointments"}
        </h5>
        <Line data={chartData} />
      </Card>

      {/* RECENT APPOINTMENTS — UPDATED */}
      <Card style={panelBox}>
        <h5 style={panelTitle}>
          {language === "TH" ? "การนัดหมายล่าสุด" : "Recent Appointments"}
        </h5>

        {recentAppointments.map((a) => (
          <div key={a.id} style={recentItem}>
            <div>
              <strong style={{ fontSize: 15 }}>
                {a.firstName} {a.lastName}
              </strong>
              <p style={recentSub}>{a.department}</p>
            </div>

            {/* ⭐ Badge สถานะพร้อมสี + แปลภาษา */}
            <Badge
              bg={statusColor[a.status] || "secondary"}
              style={statusBadge}
            >
              {getStatusLabel(a.status)}
            </Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ==========================
// Styles
// ==========================
const pageWrapper = {
  padding: "32px",
  background: "#f7f7fc",
  minHeight: "100vh",
};

const pageTitle = {
  fontWeight: "700",
  marginBottom: 20,
  fontSize: 28,
  color: "#372a6d",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 18,
};

const summaryCard = {
  padding: 22,
  borderRadius: 18,
  background: "white",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cardLabel = { fontSize: 14, opacity: 0.7 };
const cardValue = { margin: "6px 0", fontSize: 28, fontWeight: 700, color: "#1e1b4b" };
const cardSub = { fontSize: 12, opacity: 0.55 };

const iconBox = (bg) => ({
  background: bg,
  width: 52,
  height: 52,
  borderRadius: 12,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const chartPanel = {
  padding: 25,
  marginTop: 28,
  borderRadius: 18,
  background: "#ffffff",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
};

const panelBox = {
  padding: 25,
  marginTop: 28,
  borderRadius: 18,
  background: "#ffffff",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
};

const panelTitle = {
  fontWeight: 700,
  marginBottom: 18,
  color: "#372a6d",
};

const recentItem = {
  padding: "14px 0",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const recentSub = {
  opacity: 0.6,
  fontSize: 13,
  marginTop: 3,
};

const statusBadge = {
  fontSize: 12,
  padding: "6px 12px",
  borderRadius: 12,
  textTransform: "capitalize",
};

const loadingWrapper = {
  height: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
