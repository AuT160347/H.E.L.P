import { useState, useEffect, useContext } from "react";
import { Container, Card, Row, Col, Badge, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import { LanguageContext } from "../components/LanguageContext";
import { getCurrentUser } from "../datas/acc";

const History = () => {
    const { text, language } = useContext(LanguageContext);
    const t = text[language].history;
    const statusText = text[language].history.status;

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString, timeString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString(
            language === "TH" ? "th-TH" : "en-US",
            { day: "numeric", month: "long", year: "numeric" }
        );
        return `${formattedDate} | ${timeString || ""}`;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "confirmed": return "success";
            case "pending": return "warning";
            case "doctor_rejected": return "danger";
            case "sent_to_doctor": return "info";
            case "doctor_reviewed": return "primary";
            case "completed": return "primary";
            default: return "secondary";
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            const user = getCurrentUser();
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get("https://691b3e462d8d785575722661.mockapi.io/Patient-Admin");
                const myHistory = res.data.filter(item => item.user === user.username);
                setAppointments(myHistory.reverse());
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <Container className="py-5" style={{ minHeight: "100vh" }}>
            <h2 className="fw-bold mb-4 text-center">{t.title}</h2>

            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="mx-auto" style={{ maxWidth: "1000px" }}>
                    
                    {/* Table Header */}
                    <div className="d-none d-md-flex bg-dark text-white p-3 rounded-top fw-bold">
                        <Col md={3}>{t.colName}</Col>
                        <Col md={3}>{t.colDate}</Col>
                        <Col md={2}>{t.colDoctor}</Col>
                        <Col md={2}>{t.colSymptom}</Col>
                        <Col md={2} className="text-center">{t.colStatus}</Col>
                    </div>

                    <div className="bg-light p-3 rounded-bottom shadow-sm" style={{ minHeight: "300px" }}>
                        {appointments.length === 0 ? (
                            <p className="text-center text-muted mt-5">{t.empty}</p>
                        ) : (
                            appointments.map((item) => (
                                <Card key={item.id} className="mb-3 border-0 shadow-sm hover-shadow">
                                    <Card.Body>
                                        <Row className="align-items-center">

                                            {/* Patient */}
                                            <Col md={3} xs={12} className="mb-2 mb-md-0 d-flex align-items-center gap-2">
                                                <div
                                                    className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white"
                                                    style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                                                >
                                                    {item.gender === "male" ? "👨🏻" :
                                                     item.gender === "female" ? "👩🏻" : "👤"}
                                                </div>
                                                <div>
                                                    <div className="fw-bold">{item.firstName} {item.lastName}</div>
                                                    <small className="text-muted">{item.phoneNumber}</small>
                                                </div>
                                            </Col>

                                            {/* Date / Department */}
                                            <Col md={3} xs={6} className="mb-2 mb-md-0">
                                                <small className="d-md-none fw-bold text-secondary">{t.colDate}: </small>
                                                <div>{formatDate(item.preferredDate, item.preferredTime)}</div>
                                                <small className="text-muted">{item.department || "-"}</small>
                                            </Col>

                                            {/* Doctor */}
                                            <Col md={2} xs={6} className="mb-2 mb-md-0">
                                                <small className="d-md-none fw-bold text-secondary">{t.colDoctor}: </small>
                                                <div>{item.doctor}</div>
                                            </Col>

                                            {/* Symptoms */}
                                            <Col md={2} xs={12} className="mb-2 mb-md-0 text-truncate">
                                                <small className="d-md-none fw-bold text-secondary">{t.colSymptom}: </small>
                                                {item.symptomsEtc || "-"}
                                            </Col>

                                            {/* Status */}
                                            <Col md={2} xs={12} className="text-md-center text-start">
                                                <Badge bg={getStatusBadge(item.status)} className="px-3 py-2 rounded-pill">
                                                    {statusText[item.status] || item.status}
                                                </Badge>
                                            </Col>
                                        </Row>

                                        {/* ⭐ แสดงเหตุผลที่หมอยกเลิกนัด */}
                                        {item.status === "doctor_rejected" && item.note && (
                                            <div className="mt-3 text-danger">
                                                <strong>{t.ReasonForDeclining}:</strong> {item.note}
                                            </div>
                                        )}

                                        {/* 📄 View Medical Document */}
                                        {item.medical && (
                                            <div className="mt-3">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => {
                                                        const win = window.open();
                                                        win.document.write(
                                                            `<iframe src="${item.medical}" style="width:100%;height:100%"></iframe>`
                                                        );
                                                    }}
                                                >
                                                    {t.viewFile || t.viewMedical}
                                                </Button>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            )}
        </Container>
    );
};

export default History;
