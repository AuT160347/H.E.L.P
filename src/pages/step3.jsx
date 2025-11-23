import { useContext, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import Stepper from "../components/Stepper";
import { LanguageContext } from "../components/LanguageContext";
import { getCurrentUser } from "../datas/acc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Appointment.css";

const Step3 = ({ prev, formData }) => {
    const { text, language } = useContext(LanguageContext);
    const t = text[language].step3;
    const common = text[language].appointment;
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const displayDoctor = formData.doctor === "auto"
        ? common.autoDoctor
        : formData.doctorName;

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString(language === "TH" ? "th-TH" : "en-US", {
            year: "numeric", month: "long", day: "numeric"
        });
    };

    const handleFinalSubmit = async () => {
        if (!window.confirm(t.confirmMsg)) return;

        setIsSubmitting(true);
        const currentUser = getCurrentUser();

        const payload = {
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime,
            backupDate: formData.backupDate,
            backupTime: formData.backupTime,

            doctor: formData.doctor === "auto" ? "Auto Assign" : formData.doctorName,
            department: formData.department,  // ✅ FIXED

            personSeeing: formData.isSelf,
            prefix: formData.prefix,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dob: formData.dob,
            gender: formData.gender,
            nationality: formData.nationality,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            idCard: formData.idCard,
            "hospital-number": formData.hospitalNumber,
            symptomsEtc: formData.symptomsEtc,

            medical: formData.medical,
            medicalFileName: formData.medicalFileName,

            status: "pending",
            user: currentUser ? currentUser.username : "guest",
        };

        try {
            await axios.post("https://691b3e462d8d785575722661.mockapi.io/Patient-Admin", payload);
            alert(t.successMsg);
            navigate("/home");
        } catch (error) {
            alert("Error submitting");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="p-4 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Stepper step={3} />

            <div className="mt-4 w-100" style={{ maxWidth: "800px" }}>
                <Card className="border-0 shadow-sm">
                    <Card.Body>

                        <h5 className="fw-bold mb-3">{t.doctorInfo}</h5>

                        <Row><Col xs={5}>{t.doctor}</Col><Col>{displayDoctor}</Col></Row>
                        <Row><Col xs={5}>{t.department}</Col><Col>{formData.department}</Col></Row>

                        <h5 className="fw-bold mt-4 mb-3">{t.patientInfo}</h5>

                        <Row><Col xs={5}>{t.name}</Col><Col>{formData.prefixLabel} {formData.firstName} {formData.lastName}</Col></Row>
                        <Row><Col xs={5}>{t.phone}</Col><Col>{formData.phoneNumber}</Col></Row>

                        <h5 className="fw-bold mt-4 mb-3">{t.symptomsInfo}</h5>

                        <Row><Col className="bg-light p-3 rounded">{formData.symptomsEtc}</Col></Row>

                        {formData.medicalFileName && (
                            <>
                                <h6 className="mt-3">📄 {formData.medicalFileName}</h6>
                                <button className="btn btn-outline-primary mt-2"
                                    onClick={() => {
                                        const win = window.open();
                                        win.document.write(`<iframe src="${formData.medical}" style="width:100%;height:100%"></iframe>`);
                                    }}>
                                    {t.viewMedic}
                                </button>
                            </>
                        )}

                    </Card.Body>
                </Card>

                <div className="d-flex justify-content-between mt-4">
                    <button className="learn-more" onClick={prev}>{common.back}</button>
                    <button className="learn-more" onClick={handleFinalSubmit}>{common.submit}</button>
                </div>
            </div>
        </div>
    );
};

export default Step3;
