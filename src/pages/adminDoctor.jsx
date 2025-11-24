import { useState, useEffect, useContext } from "react";
import { Container, Card, Row, Col, Button, Badge, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { LanguageContext } from "../components/LanguageContext";

const AdminDoctor = () => {
    const { text, language } = useContext(LanguageContext);
    const t = text[language].adminDoctor;
    const [appointments, setAppointments] = useState([]);
    const [key, setKey] = useState("new");

    const API_URL = "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setAppointments(res.data);
        } catch (error) { console.error(error); }
    };

    const updateStatus = async (id, newStatus, msg) => {
        try {
            await axios.put(`${API_URL}/${id}`, { status: newStatus });
            setAppointments(prev =>
                prev.map(i => i.id === id ? { ...i, status: newStatus } : i)
            );

            Swal.fire({ icon: "success", title: msg, timer: 1500, showConfirmButton: false });
        } catch (error) { console.error(error); }
    };

    const AppointmentCard = ({ item, actionButton }) => (
        <Card className="mb-3 shadow-sm border-0">
            <Card.Body>
                <Row className="align-items-center">
                    <Col md={4}>
                        <h5 className="fw-bold text-primary">
                            {item.firstName} {item.lastName}
                        </h5>

                        <small className="text-muted">
                            🩺 {item.doctor} <br />
                            🏥 {item.department}
                        </small>
                            <br />
                        {item.medical && (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    const win = window.open();
                                    win.document.write(
                                        `<iframe src="${item.medical}" style="width:100%;height:100%"></iframe>`
                                    );
                                }}
                            >
                                📄 {t.viewMedical}
                            </Button>
                        )}
                    </Col>

                    <Col md={4}>
                        <div>📅 {item.preferredDate}</div>
                        <div>⏰ {item.preferredTime}</div>
                    </Col>

                    <Col md={4} className="text-end">
                        {actionButton}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );

    const newRequests = appointments.filter(a => a.status === "pending");
    const waiting = appointments.filter(a => a.status === "sent_to_doctor");
    const replied = appointments.filter(a => a.status === "doctor_reviewed");

    return (
        <Container className="py-5" style={{height: "600px"}}>
            <h2 className="fw-bold mb-4">{t.title}</h2>

            <Tabs activeKey={key} onSelect={k => setKey(k)}>

                {/* คำขอใหม่ */}
                <Tab eventKey="new" title={`${t.tabNew} (${newRequests.length})`}>
                    {newRequests.length === 0 ? (
                        <p className="text-muted text-center mt-5">{t.emptyNew}</p>
                    ) : (
                        newRequests.map(item => (
                            <AppointmentCard
                                key={item.id}
                                item={item}
                                actionButton={
                                    <Button
                                        variant="info"
                                        className="text-white"
                                        onClick={() =>
                                            updateStatus(item.id, "sent_to_doctor", t.msgSent)
                                        }
                                    >
                                        ✉️ {t.btnSendToDoctor}
                                    </Button>
                                }
                            />
                        ))
                    )}
                </Tab>

                {/* รอหมอตอบ */}
                <Tab eventKey="waiting" title={`${t.tabWaiting} (${waiting.length})`}>
                    {waiting.length === 0 ? (
                        <p className="text-muted text-center mt-5">{t.emptyWait}</p>
                    ) : (
                        waiting.map(item => (
                            <AppointmentCard
                                key={item.id}
                                item={item}
                                actionButton={<Badge bg="secondary">⏳ Pending Review...</Badge>}
                            />
                        ))
                    )}
                </Tab>

                {/* หมอตอบแล้ว */}
                <Tab eventKey="replied" title={`${t.tabReplied} (${replied.length})`}>
                    {replied.length === 0 ? (
                        <p className="text-muted text-center mt-5">{t.emptyReply}</p>
                    ) : (
                        replied.map(item => (
                            <AppointmentCard
                                key={item.id}
                                item={item}
                                actionButton={
                                    <Button
                                        variant="success"
                                        onClick={() =>
                                            updateStatus(item.id, "confirmed", t.msgConfirmed)
                                        }
                                    >
                                        ✅ {t.btnConfirmToPatient}
                                    </Button>
                                }
                            />
                        ))
                    )}
                </Tab>
            </Tabs>
        </Container>
    );
};

export default AdminDoctor;
