import { useEffect, useState, useContext } from "react";
import { Table, Button, Spinner, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { LanguageContext } from "../../components/LanguageContext";
import { getCurrentUser } from "../../datas/acc";

// ใช้ API เดียว
const DOCTOR_API = "https://6913645df34a2ff1170bd0d7.mockapi.io/doctors";

export default function DoctorListPage() {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalFilter, setHospitalFilter] = useState("");

  const daysTH = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
  const daysEN = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getScheduleText = (schedule) => {
    if (!schedule) return "-";
    const keys = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const map = language === "TH" ? daysTH : daysEN;

    return keys
      .filter((k) => schedule[k])
      .map((k, idx) => map[idx])
      .join(", ");
  };

  // Load doctors
  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "admin") {
      navigate("/home");
      return;
    }
    loadDoctors();
  }, [language]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(DOCTOR_API);

      // latest first
      const sorted = [...res.data].reverse();
      setDoctors(sorted);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "โหลดข้อมูลแพทย์ไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (doc) => {
    const confirm = await Swal.fire({
      title: language === "TH" ? "ลบแพทย์?" : "Delete doctor?",
      text:
        language === "TH"
          ? `คุณต้องการลบ ${doc.name}?`
          : `Delete ${doc.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: language === "TH" ? "ลบ" : "Delete",
      cancelButtonText: language === "TH" ? "ยกเลิก" : "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${DOCTOR_API}/${doc.id}`);

      Swal.fire(
        language === "TH" ? "สำเร็จ" : "Success",
        language === "TH" ? "ลบเรียบร้อย" : "Deleted successfully",
        "success"
      );

      loadDoctors();
    } catch (err) {
      Swal.fire("Error", "ไม่สามารถลบได้", "error");
    }
  };

  // Filter doctors by hospital
  const filteredDoctors = hospitalFilter
    ? doctors.filter((d) => d.hospital === hospitalFilter)
    : doctors;

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">
        {language === "TH" ? "รายชื่อแพทย์ทั้งหมด" : "All Doctors"}
      </h2>

      {/* Filter */}
      <Card className="p-3 shadow-sm mb-3">
        <Form.Select
          value={hospitalFilter}
          onChange={(e) => setHospitalFilter(e.target.value)}
        >
          <option value="">
            {language === "TH" ? "แสดงทุกโรงพยาบาล" : "All Hospitals"}
          </option>

          {[...new Set(doctors.map((d) => d.hospital))].map((hs) => (
            <option key={hs} value={hs}>
              {hs}
            </option>
          ))}
        </Form.Select>
      </Card>

      {/* Doctor List */}
      <Card className="shadow-sm">
        <Card.Body>
          {filteredDoctors.length === 0 ? (
            <p className="text-center text-muted">
              {language === "TH" ? "ไม่พบข้อมูลแพทย์" : "No doctors found."}
            </p>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{language === "TH" ? "ชื่อ (TH/EN)" : "Name (TH/EN)"}</th>
                  <th>{language === "TH" ? "แผนก" : "Department"}</th>
                  <th>{language === "TH" ? "โรงพยาบาล" : "Hospital"}</th>
                  <th>{language === "TH" ? "วันทำงาน" : "Schedule"}</th>
                  <th>{language === "TH" ? "จัดการ" : "Actions"}</th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((d, index) => (
                  <tr key={d.id}>
                    <td>{index + 1}</td>
                    <td>
                      {d.name}
                      <br />
                      <small className="text-muted">
                        {d.nameEN || d.name}
                      </small>
                    </td>
                    <td>{d.department}</td>
                    <td>{d.hospital}</td>
                    <td>{getScheduleText(d.schedule)}</td>

                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() =>
                          navigate(`/dashboard/doctors/${d.id}/edit`, {
                            state: { doctor: d },
                          })
                        }
                      >
                        {language === "TH" ? "แก้ไข" : "Edit"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => deleteDoctor(d)}
                      >
                        {language === "TH" ? "ลบ" : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
