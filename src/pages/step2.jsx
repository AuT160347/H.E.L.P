import { useState, useContext, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Stepper from "../components/Stepper";
import { LanguageContext } from "../components/LanguageContext";
import { getCurrentUser } from "../datas/acc";
import "./Appointment.css";

const Step2 = ({ next, prev, updateFormData, formData }) => {
    const { text, language } = useContext(LanguageContext);
    const t = text[language].step2;

    const [isSelf, setIsSelf] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Form States
    const [prefix, setPrefix] = useState(formData.prefix || "");
    const [firstName, setFirstName] = useState(formData.firstName || "");
    const [lastName, setLastName] = useState(formData.lastName || "");
    const [dob, setDob] = useState(formData.dob || "");
    const [gender, setGender] = useState(formData.gender || "");
    const [nationality, setNationality] = useState(formData.nationality || "");
    const [otherNationality, setOtherNationality] = useState(formData.otherNationality || "");
    const [phoneNumber, setPhoneNumber] = useState(formData.phoneNumber || "");
    const [email, setEmail] = useState(formData.email || "");
    const [idCard, setIdCard] = useState(formData.idCard || "");
    const [hospitalNumber, setHospitalNumber] = useState(formData.hospitalNumber || "");
    const [symptoms, setSymptoms] = useState(formData.symptomsEtc || "");
    const [medicalFileName, setMedicalFileName] = useState(formData.medicalFileName || "");

    /* Convert file → Base64 */
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    /* โหลด user */
    useEffect(() => {
        const user = getCurrentUser();
        if (user) setCurrentUser(user);
    }, []);

    /* Autofill */
    useEffect(() => {
        if (currentUser && isSelf) {
            setPrefix(currentUser.prefix || "");
            setFirstName(currentUser.firstname || "");
            setLastName(currentUser.lastname || "");
            setEmail(currentUser.email || "");
            setPhoneNumber(currentUser.phone || "");
            setIdCard(currentUser.idCard || "");
            setDob(currentUser.dob || "");
            setGender(currentUser.gender || "");
        }
    }, [currentUser]);

    /* เมื่อสลับเป็นตัวเอง/ผู้อื่น */
    useEffect(() => {
        if (!isSelf) {
            setPrefix("");
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhoneNumber("");
            setIdCard("");
            setDob("");
            setGender("");
            setNationality("");
            setOtherNationality("");
        } else if (currentUser) {
            setPrefix(currentUser.prefix || "");
            setFirstName(currentUser.firstname || "");
            setLastName(currentUser.lastname || "");
            setEmail(currentUser.email || "");
            setPhoneNumber(currentUser.phone || "");
            setIdCard(currentUser.idCard || "");
            setDob(currentUser.dob || "");
            setGender(currentUser.gender || "");
        }
    }, [isSelf]);

    const handleNext = (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !phoneNumber || !dob) {
            alert(language === "TH" ? "กรุณากรอกข้อมูลจำเป็นให้ครบถ้วน" : "Please fill required fields.");
            return;
        }

        let currentPrefixLabel = "";
        if (prefix === "mr") currentPrefixLabel = t.mr;
        else if (prefix === "mrs") currentPrefixLabel = t.mrs;
        else if (prefix === "ms") currentPrefixLabel = t.ms;

        updateFormData({
            prefix,
            prefixLabel: currentPrefixLabel,
            firstName, lastName, dob, gender,
            nationality,
            otherNationality: nationality === "other" ? otherNationality : "",
            phoneNumber, email, idCard, hospitalNumber,
            symptomsEtc: symptoms,
            medical: formData.medical || "",  // base64 file
            medicalFileName,
            isSelf
        });

        next();
    };

    return (
        <div className="p-4 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Stepper step={2} />
            <div style={{ maxWidth: "700px", width: "100%" }}>
                <h4 className="text-start fw-bold mb-3">{t.header}</h4>
                <Form>

                    {/* ตัวเอง / ผู้อื่น */}
                    <Row className="g-3 mb-4">
                        <Col xs={6}>
                            <div
                                className={`p-3 border rounded d-flex align-items-center gap-2 ${isSelf ? "border-primary bg-light" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsSelf(true)}
                            >
                                <Form.Check type="radio" checked={isSelf} readOnly />
                                <span className="fw-bold">{t.self}</span>
                            </div>
                        </Col>

                        <Col xs={6}>
                            <div
                                className={`p-3 border rounded d-flex align-items-center gap-2 ${!isSelf ? "border-primary bg-light" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsSelf(false)}
                            >
                                <Form.Check type="radio" checked={!isSelf} readOnly />
                                <span className="fw-bold">{t.other}</span>
                            </div>
                        </Col>
                    </Row>

                    {/* ข้อมูลผู้ป่วย */}
                    <Row className="g-3 mb-3">
                        <Col md={3}>
                            <Form.Select
                                className="py-2 text-muted"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                            >
                                <option value="">{t.prefix}</option>
                                <option value="mr">{t.mr}</option>
                                <option value="mrs">{t.mrs}</option>
                                <option value="ms">{t.ms}</option>
                            </Form.Select>
                        </Col>

                        <Col md={4}>
                            <Form.Control
                                className="py-2"
                                placeholder={t.firstname}
                                value={firstName}
                                disabled={isSelf}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Col>

                        <Col md={5}>
                            <Form.Control
                                className="py-2"
                                placeholder={t.lastname}
                                value={lastName}
                                disabled={isSelf}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Col>
                    </Row>

                    {/* วันเกิด / เพศ */}
                    <Row className="g-3 mb-3">
                        <Col md={6}>
                            <Form.Control
                                type="date"
                                className="py-2 text-muted"
                                value={dob}
                                disabled={isSelf}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </Col>

                        <Col md={6}>
                            <Form.Select
                                className="py-2 text-muted"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">{t.gender}</option>
                                <option value="male">{t.male}</option>
                                <option value="female">{t.female}</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* สัญชาติ */}
                    <Row className="g-3 mb-3">
                        <Col md={6}>
                            <Form.Select
                                className="py-2 text-muted"
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                            >
                                <option value="">{t.nationality}</option>
                                <option value="thai">{t.nationThai}</option>
                                <option value="other">{t.nationOther}</option>
                            </Form.Select>
                        </Col>

                        <Col md={6}>
                            {nationality === "other" ? (
                                <Form.Control
                                    className="py-2"
                                    placeholder={language === "TH" ? "ระบุสัญชาติ" : "Enter nationality"}
                                    value={otherNationality}
                                    onChange={(e) => setOtherNationality(e.target.value)}
                                />
                            ) : (
                                <div></div>
                            )}
                        </Col>
                    </Row>

                    {/* เบอร์ / อีเมล */}
                    <Row className="g-3 mb-3">
                        <Col md={6}>
                            <Form.Control
                                className="py-2"
                                type="number"
                                placeholder={t.phone}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </Col>

                        <Col md={6}>
                            <Form.Control
                                className="py-2"
                                type="email"
                                placeholder={t.email}
                                value={email}
                                disabled={isSelf}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Col>
                    </Row>

                    {/* บัตรประชาชน / HN */}
                    <Row className="g-3 mb-3">
                        <Col md={6}>
                            <Form.Control
                                className="py-2"
                                type="number"
                                placeholder={t.idCard}
                                value={idCard}
                                onChange={(e) => setIdCard(e.target.value)}
                            />
                        </Col>

                        <Col md={6}>
                            <Form.Control
                                className="py-2"
                                placeholder={t.hn}
                                value={hospitalNumber}
                                onChange={(e) => setHospitalNumber(e.target.value)}
                            />
                        </Col>
                    </Row>

                    {/* อาการ */}
                    <div className="mb-4">
                        <h6 className="fw-bold">{t.symptomsHeader}</h6>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            className="mt-2"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                    </div>

                    {/* อัพโหลดเอกสาร */}
                    <div className="mb-4 p-4 text-center rounded"
                        style={{ border: "1px dashed #0d6efd", backgroundColor: "#f8faff" }}>

                        <div
                            className="text-primary fw-bold fs-5 mb-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => document.getElementById("medicalUploadInput").click()}
                        >
                            {t.uploadHeader}
                        </div>

                        <small className="text-muted">
                            {medicalFileName ? `✅ ${medicalFileName}` : t.uploadDesc}
                        </small>

                        {/* hidden input */}
                        <input
                            id="medicalUploadInput"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const base64 = await fileToBase64(file);

                                setMedicalFileName(file.name);
                                updateFormData({
                                    ...formData,
                                    medical: base64,
                                    medicalFileName: file.name,
                                });
                            }}
                        />

                        <br />

                        {/* ปุ่มเปิดไฟล์ */}
                        {formData.medical && (
                            <button
                                className="btn btn-outline-primary mt-3 me-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const win = window.open();
                                    win.document.write(
                                        `<iframe src="${formData.medical}" style="width:100%;height:100%"></iframe>`
                                    );
                                }}
                            >
                                เปิดไฟล์
                            </button>
                        )}

                        {/* ปุ่มลบไฟล์ */}
                        {formData.medical && (
                            <button
                                className="btn btn-outline-danger mt-3"
                                onClick={(e) => {
                                    e.preventDefault();

                                    setMedicalFileName("");
                                    updateFormData({
                                        ...formData,
                                        medical: "",
                                        medicalFileName: "",
                                    });

                                    // เคลียร์ input file
                                    document.getElementById("medicalUploadInput").value = "";
                                }}
                            >
                                ลบไฟล์
                            </button>
                        )}
                    </div>


                    {/* consent */}
                    <p className="text-muted mb-5" style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
                        {t.consentText} <a href="#" className="text-decoration-none">{t.rightsLink}</a>
                        {t.and} <a href="#" className="text-decoration-none">{t.privacyLink}</a> {t.consentEnd}
                    </p>

                    <div className="d-flex justify-content-between mt-4">
                        <button className="learn-more" onClick={(e) => { e.preventDefault(); prev(); }}>
                            {t.back}
                        </button>
                        <button className="learn-more" onClick={handleNext}>
                            {text[language].appointment.next}
                        </button>
                    </div>

                </Form>
            </div>
        </div>
    );
};

export default Step2;
