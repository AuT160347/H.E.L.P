import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Card } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { LanguageContext } from "../../components/LanguageContext";
import { getCurrentUser } from "../../datas/acc";
import "./HospitalDoctor.css";''

const HOSPITAL_API = "https://691205be52a60f10c8205121.mockapi.io/hospital";
const DOCTOR_API = "https://6913645df34a2ff1170bd0d7.mockapi.io/doctors";

export default function HospitalDoctors() {
  const { language } = useContext(LanguageContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const hospitalId = id;

  const daysTH = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
  const daysEN = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const dayKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // ============================
  // ⭐ Normalize schedule function
  // ============================
  const normalizeSchedule = (raw) => {
    const result = {};
    dayKeys.forEach((k) => {
      result[k] =
        raw?.schedule?.[k] === true ||
        raw?.schedule?.[k] === "true" ||
        raw?.[k] === true ||
        raw?.[k] === "true";
    });
    return result;
  };

  // ============================
  // Load data
  // ============================
  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "admin") {
      navigate("/home");
      return;
    }
    loadAll();
  }, [language]);

  const loadAll = async () => {
    try {
      setLoading(true);

      const hosRes = await axios.get(`${HOSPITAL_API}/${hospitalId}`);
      setHospital(hosRes.data);

      const docRes = await axios.get(DOCTOR_API);

      const filtered = docRes.data
        .filter((d) => d.hospitalId == hospitalId)
        .map((doc) => ({
          ...doc,
          schedule: normalizeSchedule(doc), // ⭐ สำคัญมาก
        }));

      setDoctors(filtered);
    } catch (err) {
      Swal.fire("Error", "โหลดข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // ⭐ Correct schedule display
  // ============================
  const getScheduleText = (doctor) => {
    const map = language === "TH" ? daysTH : daysEN;

    const active = dayKeys
      .map((day, index) => (doctor.schedule?.[day] ? map[index] : null))
      .filter(Boolean);

    return active.length ? active.join(", ") : "-";
  };

  // ============================
  // Delete doctor
  // ============================
  const deleteDoctor = async (doctor) => {
    const confirm = await Swal.fire({
      title: language === "TH" ? "ลบแพทย์?" : "Delete doctor?",
      text:
        language === "TH"
          ? `คุณต้องการลบ ${doctor.nameTH || doctor.name}?`
          : `Delete ${doctor.nameTH || doctor.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: language === "TH" ? "ลบ" : "Delete",
      cancelButtonText: language === "TH" ? "ยกเลิก" : "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${DOCTOR_API}/${doctor.id}`);
      Swal.fire("สำเร็จ", "ลบเรียบร้อย", "success");
      loadAll();
    } catch (err) {
      Swal.fire("Error", "ไม่สามารถลบได้", "error");
    }
  };

  if (loading || !hospital) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="container py-4">
      <Button variant="light" onClick={() => navigate("/dashboard/hospitals")}>
        ← {language === "TH" ? "กลับ" : "Back"}
      </Button>

      <h2 className="fw-bold mt-3 mb-4">
        {language === "TH" ? "รายชื่อแพทย์ — " : "Doctors — "}
        {language === "TH" ? hospital.hospitalNameTH : hospital.hospitalNameEN}
      </h2>

      <div className="text-end mb-3">
        <Button
          variant="primary"
          onClick={() =>
            navigate("/dashboard/add-doctor", {
              state: {
                hospitalId,
                hospitalTH: hospital.hospitalNameTH,
                hospitalEN: hospital.hospitalNameEN,
              },
            })
          }
        >
          {language === "TH" ? "+ เพิ่มแพทย์" : "+ Add Doctor"}
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Table hover responsive className="doctor-table">
            <thead>
              <tr>
                <th>{language === "TH" ? "ลำดับ" : "List"}</th>
                <th>{language === "TH" ? "ชื่อ" : "Name"}</th>
                <th>{language === "TH" ? "แผนก" : "Department"}</th>
                <th>{language === "TH" ? "วันออกตรวจ" : "Inspection Day"}</th>
                <th>{language === "TH" ? "จัดการ" : "Manage"}</th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((d, i) => (
                <tr key={d.id}>
                  <td>{i + 1}</td>

                  <td>
                    <strong>{language==="TH"?d.nameTH:d.nameEN}</strong>
                    <br />
                    <span className="text-muted">{language==="TH"?d.nameEN:d.nameTH}</span>
                  </td>

                  <td>
                    <strong>{language==="TH"?d.departmentTH:d.departmentEN}</strong>
                    <br />
                    <span className="text-muted">{language==="TH"?d.departmentEN:d.departmentTH}</span>
                  </td>

                  <td>{getScheduleText(d)}</td>

                  <td>
                    <Button
                      size="sm"
                      className="me-2"
                      variant="outline-primary"
                      onClick={() =>
                        navigate(`/dashboard/doctors/${d.id}/edit`, {
                          state: { doctor: d },
                        })
                      }
                    >
                      {language==="TH"?"แก้ไข":"Edit"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteDoctor(d)}
                    >
                      {language==="TH"?"ลบ":"Delete"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
