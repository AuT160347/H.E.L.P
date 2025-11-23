import { useState, useEffect, useContext } from "react";
import { Container, Card, Row, Col, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { LanguageContext } from "../components/LanguageContext";
import { getCurrentUser } from "../datas/acc";

const DoctorAdmin = () => {
    const { text, language } = useContext(LanguageContext);
    const t = text[language].doctorAdmin;
    const [tasks, setTasks] = useState([]);

    const [showRejectModal, setShowRejectModal] = useState(false);
       const [rejectNote, setRejectNote] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const API_URL = "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) return;

            const res = await axios.get(API_URL);
            const doctorFullName = `${currentUser.firstname} ${currentUser.lastname}`.trim();

            const myTasks = res.data.filter(item => {
                const isStatusMatch = item.status === "sent_to_doctor";

                const isDoctorMatch =
                    item.doctor === doctorFullName ||
                    item.doctor.includes(currentUser.firstname) ||
                    item.doctor === currentUser.username;

                return isStatusMatch && isDoctorMatch;
            });

            setTasks(myTasks);
        } catch (error) {
            console.error("Error:", error);
        }
    };

   const handleAccept = async (id) => {
    try {
        const task = tasks.find(item => item.id === id);

        await axios.put(`${API_URL}/${id}`, {
            ...task,
            status: "doctor_reviewed"
        });

        setTasks(prev => prev.filter(item => item.id !== id));

        Swal.fire({
            icon: "success",
            title: t.msgAccepted,
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Error:", error);
    }
};


    /* ----- เปิด Modal ----- */
    const handleOpenReject = (id) => {
        setSelectedId(id);
        setRejectNote("");
        setShowRejectModal(true);
    };

    /* ----- ส่งข้อมูลปฏิเสธกลับ Admin ----- */
   const handleRejectSubmit = async () => {
    if (!rejectNote.trim()) {
        Swal.fire({
            icon: "warning",
            title: "กรุณากรอกหมายเหตุ"
        });
        return;
    }

    try {
        const task = tasks.find(item => item.id === selectedId);

        await axios.put(`${API_URL}/${selectedId}`, {
            ...task,
            status: "doctor_rejected",
            note: rejectNote
        });

        setTasks(prev => prev.filter(item => item.id !== selectedId));

        Swal.fire({
            icon: "success",
            title: "ส่งกลับแอดมินแล้ว",
            timer: 1500,
            showConfirmButton: false
        });

        setShowRejectModal(false);
    } catch (error) {
        console.error("Error:", error);
    }
};


    return (
        <Container className="py-5" style={{ minHeight: "100vh" }}>
            <h2 className="fw-bold mb-4 text-primary">{t.title}</h2>

            {tasks.length === 0 ? (
                <div className="text-center mt-5 p-5 bg-light rounded">
                    <h5 className="text-muted">{t.empty}</h5>
                </div>
            ) : (
                <Row>
                    {tasks.map((item) => (
                        <Col md={6} key={item.id}>
                            <Card className="mb-4 shadow border-0 border-start border-primary border-5">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <small className="text-muted">{t.patientName}</small>
                                            <h4 className="fw-bold">
                                                {item.firstName} {item.lastName}
                                            </h4>
                                            <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                                                ID: {item.idCard || "-"}
                                            </span>
                                        </div>

                                        <div className="text-end">
                                            <div className="fw-bold text-primary">
                                                📅 {item.preferredDate}
                                            </div>
                                            <div className="fw-bold text-primary">
                                                ⏰ {item.preferredTime}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-light p-3 rounded mb-3">
                                        <strong>{t.symptom}:</strong> {item.symptomsEtc || "-"} <br />
                                    </div>

                                    {/* View Medical Document */}
                                    {item.medical && item.medical.trim() !== "" && (
                                        <div className="mb-3">
                                            <Button
                                                variant="outline-primary"
                                                className="w-100 fw-bold"
                                                onClick={() => {
                                                    const win = window.open();
                                                    win.document.write(
                                                        `<iframe src="${item.medical}" style="width:100%;height:100%"></iframe>`
                                                    );
                                                }}
                                            >
                                                {t.viewMedical}
                                            </Button>
                                        </div>
                                    )}

                                    {/* ปุ่มรับหรือไม่รับนัด */}
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="success"
                                            className="w-50 fw-bold py-2"
                                            onClick={() => handleAccept(item.id)}
                                        >
                                            {t.btnAccept}
                                        </Button>

                                        <Button
                                            variant="danger"
                                            className="w-50 fw-bold py-2"
                                            onClick={() => handleOpenReject(item.id)}
                                        >
                                            {t.btnNoAcc}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modal ปฏิเสธนัด */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t.reason}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label>{t.note}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder={t.SpecifyTheReason}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                        {t.cancel}
                    </Button>

                    <Button variant="danger" onClick={handleRejectSubmit}>
                        {t.reject}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default DoctorAdmin;
