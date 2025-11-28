// src/pages/Appointment.jsx
import { useState, useContext, useEffect } from "react";
import { Card, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";

import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

import { LanguageContext } from "../components/LanguageContext";
import { getCurrentUser } from "../datas/acc";

import "./Appointment.css";

const APPOINT_API =
  "https://691b3e462d8d785575722661.mockapi.io/Patient-Admin";

const HOSPITAL_API =
  "https://691205be52a60f10c8205121.mockapi.io/hospital";

const DOCTOR_API =
  "https://6913645df34a2ff1170bd0d7.mockapi.io/doctors";

const Appointment = () => {
  const { language, text } = useContext(LanguageContext);
  const t = text[language];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  //  Master Data
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  //  Form
  const [formData, setFormData] = useState({
    preferredDate: "",
    backupDate: "",
    preferredTime: "",
    backupTime: "",
    hospital: "",
    department: "",
    doctorMode: "auto",
    doctor: "",
    doctorId: "",

    prefix: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    idCard: "",
    hn: "",
    symptoms: "",
    medicalFileData: "",
    medicalFileName: "",
  });

  //  โหลดข้อมูล Master
  useEffect(() => {
    const loadData = async () => {
      try {
        const hospitalRes = await axios.get(HOSPITAL_API);
        setHospitals(hospitalRes.data);

        const doctorRes = await axios.get(DOCTOR_API);
        setDoctors(doctorRes.data);

        const depList = [
          ...new Set(hospitalRes.data.map((h) => h.department).flat()),
        ].filter(Boolean);

        setDepartments(depList);
      } catch (err) {
        console.error("Load master error:", err);
      }
    };

    loadData();
  }, []);

  //  เติมข้อมูลผู้ใช้
  useEffect(() => {
    const u = getCurrentUser();
    if (!u) return;

    setFormData((prev) => ({
      ...prev,
      firstName: u.firstname || "",
      lastName: u.lastname || "",
      email: u.email || "",
      dob: u.dob || "",
      gender: u.gender || "",
      phone: u.phone || "",
    }));
  }, []);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  //  ส่งข้อมูลการจอง (ใช้ใน Step3)
  const handleFinalSubmit = async () => {
    try {
      if (!formData.hospital || !formData.department) {
        return Swal.fire("แจ้งเตือน", "กรุณาเลือกโรงพยาบาลและแผนก", "warning");
      }

      const user = getCurrentUser();
      if (!user) return Swal.fire("Error", "กรุณาเข้าสู่ระบบ", "error");

      setLoading(true);

      const payload = {
        ...formData,
        user: user.username,
        phoneNumber: formData.phone,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await axios.post(APPOINT_API, payload);

      Swal.fire("สำเร็จ!", "ส่งคำขอเรียบร้อยแล้ว", "success");
      setStep(1);
    } catch (err) {
      console.error(err);
      Swal.fire("ผิดพลาด", "ไม่สามารถส่งคำขอได้", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-bg">
      <div className="appointment-container">
        <div className="appointment-header">
          <h1 className="appointment-title">{t.appointment.title}</h1>
          <ProgressBar now={progress} className="appointment-progress" />
        </div>

        <Card className="appointment-card">
          <Card.Body>
            {step === 1 && (
              <Step1
                formData={formData}
                setFormData={setFormData}
                hospitals={hospitals}
                departments={departments}
                doctors={doctors}
                next={next}
              />
            )}

            {step === 2 && (
              <Step2
                formData={formData}
                setFormData={setFormData}
                next={next}
                prev={prev}
              />
            )}

            {step === 3 && (
              <Step3
                formData={formData}
                prev={prev}
                onSubmit={handleFinalSubmit}
                loading={loading}
              />
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Appointment;
