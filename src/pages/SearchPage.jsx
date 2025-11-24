import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchDoctor } from "../datas/dataDoctor";
import { LanguageContext } from "../components/LanguageContext";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const SearchPage = () => {
    const { language } = useContext(LanguageContext);
    const { search } = useLocation();
    const navigate = useNavigate();

    const queryParam = new URLSearchParams(search).get("query") || "";
    const [query, setQuery] = useState(queryParam);
    const [results, setResults] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await fetchDoctor(language);

            const q = queryParam.toLowerCase();

            const filtered = data.filter((doc) => {
                return (
                    doc.name.toLowerCase().includes(q) ||
                    doc.department.toLowerCase().includes(q) // ✅ ค้นหาแผนกด้วย
                );
            });

            setResults(filtered);
        };

        load();
    }, [queryParam, language]);

    const handleSearch = () => {
       navigate(`/search?query=${encodeURIComponent(query)}`);
    };

    return (
        <Container className="py-5">

            {/* 🔍 Search UI */}
            <div
                className="shadow p-4 rounded mb-4"
                style={{
                    background: "#ffffff",
                    maxWidth: "600px",
                    margin: "0 auto"
                }}
            >
                <h3 className="mb-3 text-center">
                    {language === "TH" ? "ค้นหาหมอ" : "Search Doctor"}
                </h3>

                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder={
                            language === "TH"
                                ? "ค้นหาจากชื่อหมอหรือแผนก..."
                                : "Search by name or department..."
                        }
                        className="me-2"
                        size="lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <Button size="lg" variant="primary" onClick={handleSearch}>
                        {language === "TH" ? "ค้นหา" : "Search"}
                    </Button>
                </div>
            </div>

            {/* ผลลัพธ์ */}
            <h4 className="mb-3">
                {language === "TH" ? "ผลการค้นหา:" : "Search Results:"}{" "}
                <strong>{queryParam}</strong>
            </h4>

            {results.length === 0 ? (
                <p className="text-danger">
                    {language === "TH" ? "ไม่พบผลลัพธ์" : "No doctors found."}
                </p>
            ) : (
                <div className="d-flex flex-wrap gap-4">
                    {results.map((doc) => (
                        <div
                            key={doc.id}
                            className="p-3 shadow rounded text-center"
                            style={{
                                width: "260px",
                                backgroundColor: "white",
                                cursor: "pointer",
                                transition: "0.2s",
                            }}
                            onClick={() => {
                                setSelectedDoctor(doc);
                                setModalShow(true);
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <img
                                src={"img/doctorIcons.png"}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginBottom: "10px",
                                }}
                                alt=""
                            />
                            <h5 className="fw-bold">{doc.name}</h5>
                            <p className="text-muted">{doc.department}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal รายละเอียดหมอ */}
            {selectedDoctor && (
                <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {language === "TH" ? "ข้อมูลหมอ" : "Doctor Details"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="text-center">
                        <img
                            src={"img/doctorIcons.png"}
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
                                    <strong>{language === "TH" ? day.th : day.en}</strong>
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
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalShow(false)}>
                            {language === "TH" ? "ปิด" : "Close"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default SearchPage;
