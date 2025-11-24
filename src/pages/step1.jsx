import Form from "react-bootstrap/Form";
import { useState, useContext, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { LanguageContext } from "../components/LanguageContext";
import Stepper from "../components/Stepper";
import "./Appointment.css";

const times = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
];

const Step1 = ({ next, updateFormData, formData }) => {
    const { language, text } = useContext(LanguageContext);
    
    // ดึงข้อมูลแผนกจาก Context
    const departmentList = text[language].departments || [];

    const [showModal, setShowModal] = useState(false);
    const [activeTimeField, setActiveTimeField] = useState(null);
    
    // States
    const [preferredDate, setPreferredDate] = useState(formData.preferredDate || "");
    const [backupDate, setBackupDate] = useState(formData.backupDate || "");
    const [selectedTimeMain, setSelectedTimeMain] = useState(formData.preferredTime || "");
    const [selectedTimeBackup, setSelectedTimeBackup] = useState(formData.backupTime || "");
    const [selectedDepartment, setSelectedDepartment] = useState(formData.department || "");
    const [selectDoctorMode, setSelectDoctorMode] = useState(formData.doctor === "auto" ? "auto" : "manual");
    const [selectedDoctorName, setSelectedDoctorName] = useState(formData.doctorName || "");

    const [allDoctors, setAllDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);

    // ✅ Effect 1: เปลี่ยนแผนกตามภาษา (ถ้ามีค่าเดิมอยู่)
    useEffect(() => {
        if (!selectedDepartment) return;
        const thDepartments = text.TH.departments || [];
        const enDepartments = text.EN.departments || [];
        
        if (language === "TH") {
            const index = enDepartments.indexOf(selectedDepartment);
            if (index !== -1 && thDepartments[index]) setSelectedDepartment(thDepartments[index]);
        } else {
            const index = thDepartments.indexOf(selectedDepartment);
            if (index !== -1 && enDepartments[index]) setSelectedDepartment(enDepartments[index]);
        }
    }, [language]); 

    // ✅ Effect 2: โหลดหมอ "เสมอ" (เพื่อให้มีข้อมูลไว้สุ่มในโหมด Auto)
    useEffect(() => {
        const fetchDoctors = async () => {
            setLoadingDoctors(true);
            const url = language === "TH"
                ? "https://6913645df34a2ff1170bd0d7.mockapi.io/TH"
                : "https://6913645df34a2ff1170bd0d7.mockapi.io/EN";

            try {
                const res = await fetch(url);
                const data = await res.json();
                setAllDoctors(data);
            } catch (err) {
                console.error("Error loading doctors:", err);
            }
            setLoadingDoctors(false);
        };
        fetchDoctors();
    }, [language]);

    // Filter logic (สำหรับโหมด Manual)
    const filteredDoctors = allDoctors.filter((doc) => {
        const matchDept = selectedDepartment ? doc.department.includes(selectedDepartment) : true;
        const matchSearch = searchText ? doc.name.toLowerCase().includes(searchText.toLowerCase()) : true;
        return matchDept && matchSearch;
    });

    const handleSelectTime = (time) => {
        if (activeTimeField === "main") setSelectedTimeMain(time);
        else setSelectedTimeBackup(time);
        setShowModal(false);
    };

    const handleNext = (e) => {
        e.preventDefault();

        // Validation
        if (!preferredDate || !selectedTimeMain) {
            alert(language === "TH" ? "กรุณาระบุวันและเวลาที่ต้องการนัดหมาย" : "Please select preferred date and time.");
            return;
        }
        if (selectDoctorMode === "auto" && !selectedDepartment) {
            alert(language === "TH" ? "กรุณาเลือกแผนก" : "Please select a department.");
            return;
        }
        if (selectDoctorMode === "manual" && !selectedDoctorName) {
            alert(language === "TH" ? "กรุณาเลือกแพทย์" : "Please select a doctor.");
            return;
        }

        // ✅ Logic การเลือกหมอ (Manual vs Auto Random)
        let finalDoctorName = "";

        if (selectDoctorMode === "manual") {
            finalDoctorName = selectedDoctorName;
        } else {
            // 🎲 Auto Mode: สุ่มหมอจากแผนกที่เลือก
            const doctorsInDept = allDoctors.filter(doc => doc.department.includes(selectedDepartment));
            
            if (doctorsInDept.length > 0) {
                const randomDoc = doctorsInDept[Math.floor(Math.random() * doctorsInDept.length)];
                finalDoctorName = randomDoc.name; // ได้ชื่อหมอที่สุ่มแล้ว
            } else {
                finalDoctorName = "Auto Assign"; // ถ้าบังเอิญแผนกนั้นไม่มีหมอเลยในระบบ
            }
        }

        updateFormData({
            preferredDate,
            preferredTime: selectedTimeMain,
            backupDate,
            backupTime: selectedTimeBackup,
            department: selectedDepartment,
            doctor: selectDoctorMode, 
            doctorName: finalDoctorName, // ✅ ส่งชื่อหมอ (ที่เลือกเอง หรือ สุ่มมา) ไปเก็บไว้
        });

        next();
    };

    return (
        <div className="p-3 d-flex flex-column justify-content-center align-items-center text-center m-3" style={{ minHeight: "100vh" }}>
            <h2>{text[language].appointment.title}</h2>
            <Stepper step={1} />
            <hr />

            <Form style={{ maxWidth: "600px", width: "100%" }}>
                {/* Date & Time */}
                <Form.Group className="mb-3">
                    <div className="d-flex align-items-end gap-3 mb-3">
                        <div className="flex-grow-1 text-start">
                            <Form.Label>{text[language].appointment.mainDate} <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
                        </div>
                        <Button variant="outline-primary" style={{ minWidth: "100px" }} onClick={() => { setActiveTimeField("main"); setShowModal(true); }}>
                            {selectedTimeMain || text[language].appointment.selectTime}
                        </Button>
                    </div>

                    <div className="d-flex align-items-end gap-3">
                        <div className="flex-grow-1 text-start">
                            <Form.Label>{text[language].appointment.backupDate}</Form.Label>
                            <Form.Control type="date" value={backupDate} onChange={(e) => setBackupDate(e.target.value)} />
                        </div>
                        <Button variant="outline-primary" style={{ minWidth: "100px" }} onClick={() => { setActiveTimeField("backup"); setShowModal(true); }}>
                            {selectedTimeBackup || text[language].appointment.selectTime}
                        </Button>
                    </div>
                </Form.Group>

                <hr />

                {/* Doctor Selection Mode */}
                <h5 className="text-start mb-2">{text[language].appointment.doctor}</h5>
                <div className="doctor-container d-flex gap-4 mb-3">
                    <label className="doctor-option d-flex align-items-center gap-2">
                        <input type="radio" name="doctor" checked={selectDoctorMode === "auto"} onChange={() => setSelectDoctorMode("auto")} />
                        <span className="circle"></span> {text[language].appointment.autoDoctor}
                    </label>
                    <label className="doctor-option d-flex align-items-center gap-2">
                        <input type="radio" name="doctor" checked={selectDoctorMode === "manual"} onChange={() => setSelectDoctorMode("manual")} />
                        <span className="circle"></span> {text[language].appointment.selectDoctor}
                    </label>
                </div>

                {/* Department Selection */}
                <div className="mt-3 text-start">
                    <Form.Label>{text[language].appointment.department} <span className="text-danger">*</span></Form.Label>
                    <div 
                        className="p-2 border rounded d-flex justify-content-between align-items-center bg-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowDepartmentModal(true)}
                    >
                        <span className={selectedDepartment ? "text-dark" : "text-muted"}>
                            {selectedDepartment || text[language].appointment.department}
                        </span>
                        <span>▾</span>
                    </div>
                </div>

                {/* Manual Doctor Search */}
                {selectDoctorMode === "manual" && (
                    <div className="mt-4 text-start">
                        <Form.Label>{text[language].appointment.searchDoctor}</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder={text[language].appointment.searchDoctor}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        
                        <div className="mt-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {loadingDoctors ? <p>{text[language].appointment.lodeDoctor}</p> : (
                                filteredDoctors.length > 0 ? filteredDoctors.map((doc) => (
                                    <div 
                                        key={doc.id} 
                                        className={`p-3 border rounded shadow-sm text-start mb-2 ${selectedDoctorName === doc.name ? "border-primary bg-light" : ""}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setSelectedDoctorName(doc.name)}
                                    >
                                        <h6 className="fw-bold m-0">{doc.name}</h6>
                                        <small className="text-muted">{doc.department}</small>
                                    </div>
                                )) : <p className="text-muted">{text[language].appointment.noDoctorFound}</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-end mt-4">
                    <button className="learn-more" onClick={handleNext}>
                        {text[language].appointment.next}
                    </button>
                </div>
            </Form>

            {/* Time Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>{text[language].appointment.selectTime}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <div className="d-grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        {times.map((t) => (
                            <Button key={t} variant="outline-primary" onClick={() => handleSelectTime(t)}>{t}</Button>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>

            {/* Department Modal */}
            <Modal show={showDepartmentModal} onHide={() => setShowDepartmentModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>{text[language].appointment.department}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <div className="d-grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        {departmentList.map((dep) => (
                            <Button 
                                key={dep} 
                                variant="outline-primary" 
                                onClick={() => { setSelectedDepartment(dep); setShowDepartmentModal(false); }}
                            >
                                {dep}
                            </Button>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Step1;