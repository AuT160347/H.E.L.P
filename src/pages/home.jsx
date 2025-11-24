import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../components/LanguageContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import { fetchDoctor } from "../datas/dataDoctor";
import { useNavigate } from "react-router-dom";

import doctorBG from "/img/DoctorBG.jpg";
import doctorIcon from "/img/doctorIcons.png";

import "./home.css";

const Home = () => {
    const { language } = useContext(LanguageContext);
    const recommendedIds1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        const loadDoctors = async () => {
            setLoading(true);
            const data = await fetchDoctor(language);
            const filtered = data.filter((doc) => recommendedIds1.includes(doc.id));
            setDoctors(filtered);
            setLoading(false);
        };
        loadDoctors();
    }, [language]);

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div>
            {/* Search Section */}
            <Container
                fluid
                className="d-flex justify-content-center p-5 DoctorBG"
                style={{ backgroundImage: `url(${doctorBG})` }}
            >
                <Row className="w-100" style={{ marginTop: "76px", marginLeft: "-150px" }}>
                    <Col xs={10} sm={8} md={6} lg={5}>
                        <div
                            className="search-box-wrapper"
                            style={{
                                background: "rgba(49, 42, 42, 0.73)",
                                width: "650px",
                                height: "235px",
                                padding: "2rem",
                                borderRadius: "12px",
                            }}
                        >
                            <div
                                className="search-inner"
                                style={{
                                    width: "450px",
                                    marginLeft: "90px",
                                    marginTop: "25px",
                                }}
                            >
                                <div className="d-flex">
                                    <Form.Control
                                        type="text"
                                        placeholder={language === "TH" ? "ค้นหาชื่อหมอ..." : "Search Doctor..."}
                                        className="me-2"
                                        size="lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={() =>
                                            navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
                                        }
                                    >
                                        {language === "TH" ? "ค้นหา" : "Search"}
                                    </Button>

                                </div>
                                <div className="mt-2">
                                    <h5 className="text-left text-white">
                                        {language === "TH"
                                            ? "พิมพ์ชื่อหมอที่คุณต้องการค้นหาในช่องค้นหา..."
                                            : "Type a doctor’s name in the search bar..."}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Recommended Doctors */}
            <Container fluid className="py-5 px-4 bg-light">
                <h3 className="text-left mb-4 m-lg-4">
                    {language === "TH" ? "หมอแนะนำ" : "Recommended Doctors"}
                </h3>

                <div
                    className="doctor-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "20px",
                        justifyItems: "center",
                    }}
                >
                    {doctors.map((doc) => (
                        <div
                            key={doc.id}
                            className="doctor-card text-center shadow-sm rounded-4 p-2"
                            style={{
                                width: "100%",
                                maxWidth: "200px",
                                minHeight: "210px",
                                backgroundColor: "#3db8ff",
                                color: "white",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSelectedDoctor(doc);
                                setModalShow(true);
                            }}
                        >
                            <img
                                src={doctorIcon}
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    marginBottom: "12px",
                                    marginTop: "14px",
                                }}
                            />

                            <h5 style={{ fontSize: "0.85rem" }}>{doc.name}</h5>
                            <p style={{ fontSize: "0.75rem" }}>{doc.department}</p>
                        </div>
                    ))}
                </div>
            </Container>

            {/* Doctor Modal */}
            {selectedDoctor && (
                <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {language === "TH" ? "ข้อมูลหมอ" : "Doctor Details"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="text-center">
                        <img
                            src={doctorIcon}
                            alt={selectedDoctor.name}
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                marginBottom: "15px",
                            }}
                        />
                        <h4>{selectedDoctor.name}</h4>
                        <p>{selectedDoctor.department}</p>
                        <hr />

                        {/* Available Days */}
                        <div className="mt-4">
                            <h5>{language === "TH" ? "วันออกตรวจ" : "Available Days"}</h5>

                            <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                                {[
                                    { key: "monday", th: "จันทร์", en: "Monday" },
                                    { key: "tuesday", th: "อังคาร", en: "Tuesday" },
                                    { key: "wednesday", th: "พุธ", en: "Wednesday" },
                                    { key: "thursday", th: "พฤหัสบดี", en: "Thursday" },
                                    { key: "friday", th: "ศุกร์", en: "Friday" },
                                    { key: "saturday", th: "เสาร์", en: "Saturday" },
                                    { key: "sunday", th: "อาทิตย์", en: "Sunday" },
                                ].map((day) => (
                                    <div
                                        key={day.key}
                                        style={{
                                            width: "100px",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            backgroundColor: selectedDoctor[day.key]
                                                ? "#d1f7c4"
                                                : "#f2f2f2",
                                            border: selectedDoctor[day.key]
                                                ? "2px solid #198754"
                                                : "1px solid #ccc",
                                        }}
                                    >
                                        <strong>
                                            {language === "TH" ? day.th : day.en}
                                        </strong>
                                        <p
                                            style={{
                                                margin: 0,
                                                color: selectedDoctor[day.key] ? "green" : "#999",
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            {selectedDoctor[day.key]
                                                ? language === "TH"
                                                    ? "ออกตรวจ"
                                                    : "Available"
                                                : language === "TH"
                                                    ? "ไม่ออกตรวจ"
                                                    : "Unavailable"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalShow(false)}>
                            {language === "TH" ? "ปิด" : "Close"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Home;
