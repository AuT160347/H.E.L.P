import { useEffect, useState, useContext } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import "./HospitalList.css"; // ใช้ user-table style เหมือน UserManagement
import { LanguageContext } from "../../components/LanguageContext";
import { getCurrentUser } from "../../datas/acc";

const HOSPITAL_API = "https://691205be52a60f10c8205121.mockapi.io/hospital";

export default function HospitalList() {
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const u = getCurrentUser();
        if (!u || u.role !== "admin") {
            navigate("/home");
            return;
        }
        loadHospitals();
    }, []);

    const loadHospitals = async () => {
        try {
            setLoading(true);
            const res = await axios.get(HOSPITAL_API);

            const list = (res.data || []).sort(
                (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );

            setHospitals(list);
        } catch (err) {
            Swal.fire("Error", "ไม่สามารถโหลดข้อมูลโรงพยาบาลได้", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, nameTH) => {
        const confirm = await Swal.fire({
            title: language === "TH" ? "ยืนยันการลบ?" : "Delete hospital?",
            text:
                language === "TH"
                    ? `คุณต้องการลบ ${nameTH} หรือไม่`
                    : `Do you want to delete ${nameTH}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: language === "TH" ? "ลบ" : "Delete",
            cancelButtonText: language === "TH" ? "ยกเลิก" : "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.delete(`${HOSPITAL_API}/${id}`);
            Swal.fire("OK", "ลบสำเร็จ", "success");
            loadHospitals();
        } catch (err) {
            Swal.fire("Error", "ไม่สามารถลบได้", "error");
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="container py-4">

            <div className="page-header">
                <div>
                    <h2 className="title-text">
                        {language === "TH" ? "รายชื่อโรงพยาบาล" : "Hospital List"}
                    </h2>
                    <p className="desc-text">
                        {language === "TH"
                            ? "จัดการข้อมูลโรงพยาบาล และรายชื่อแพทย์ในแต่ละที่"
                            : "Manage hospitals and their doctors"}
                    </p>
                </div>

                <Button
                    variant="primary"
                    onClick={() => navigate("/dashboard/hospitals/add")}
                >
                    {language === "TH" ? "+ เพิ่มโรงพยาบาล" : "+ Add Hospital"}
                </Button>
            </div>

            {/* -------- กล่องแบบ UserManagement -------- */}
            <div className="user-container">

                {hospitals.length === 0 ? (
                    <p className="text-center text-muted my-3">
                        {language === "TH" ? "ยังไม่มีโรงพยาบาลในระบบ" : "No hospitals yet."}
                    </p>
                ) : (
                    <Table hover responsive className="user-table mb-0">
                        <thead>
                            <tr>
                                <th>{language === "TH" ? "ลำดับ" : "List"}</th>
                                <th>{language === "TH" ? "ชื่อ(ไทย)" : "Name (TH)"}</th>
                                <th>{language === "TH" ? "ชื่อ (อังกฤษ)" : "Name (EN)"}</th>
                                <th>Email</th>
                                <th>{language === "TH" ? "เบอร์โทร" : "Phone"}</th>
                                <th>{language === "TH" ? "จัดการ" : "Actions"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitals.map((h, index) => (
                                <tr key={h.id}>
                                    <td>{index + 1}</td>
                                    <td>{h.hospitalNameTH}</td>
                                    <td>{h.hospitalNameEN}</td>
                                    <td>{h.email}</td>
                                    <td>{h.phone}</td>

                                    <td className="text-end">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="me-2"
                                            onClick={() =>
                                                navigate(`/dashboard/hospitals/${h.id}/edit`)
                                            }
                                        >
                                            {language === "TH" ? "แก้ไข" : "Edit"}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline-success"
                                            className="me-2"
                                            onClick={() =>
                                                navigate(`/dashboard/hospitals/${h.id}/doctors`)
                                            }
                                        >
                                            {language === "TH" ? "ดูหมอ" : "Doctors"}
                                        </Button>

                                        <Button
                                            size="sm"
                                            className="btn-delete-outline"
                                            onClick={() => handleDelete(h.id, h.hospitalNameTH)}
                                        >
                                            {language === "TH" ? "ลบ" : "Delete"}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

            </div>
        </div>
    );
}
