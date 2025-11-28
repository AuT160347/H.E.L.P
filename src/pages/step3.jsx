// src/pages/step3.jsx
import {
  Calendar3,
  Clock,
  Hospital,
  PersonBadge,
  PersonVcard,
  FileEarmarkCheck,
} from "react-bootstrap-icons";
import { useContext } from "react";
import { LanguageContext } from "../components/LanguageContext";

const Step3 = ({ formData, prev, onSubmit, loading }) => {
  const { language, text } = useContext(LanguageContext);
  const t = text[language].step3;

  return (
    <div className="step-card">
      <h4 className="step-title">{t.header}</h4>

      <div className="review-sec mb-3">

        <div className="review-row">
          <span><Calendar3 /> {t.dateMain}</span>
          <strong>{formData.preferredDate || "-"}</strong>
        </div>

        <div className="review-row">
          <span><Clock /> {t.doctorInfo}</span>
          <strong>{formData.preferredTime || "-"}</strong>
        </div>

        <div className="review-row">
          <span><Calendar3 /> {t.dateBackup}</span>
          <strong>{formData.backupDate || "-"}</strong>
        </div>

        <div className="review-row">
          <span><Clock /> {t.dateBackup}</span>
          <strong>{formData.backupTime || "-"}</strong>
        </div>

        <div className="review-row">
          <span><Hospital /> {t.department}</span>
          <strong>{formData.hospital || "-"}</strong>
        </div>

        <div className="review-row">
          <span><PersonBadge /> {t.department}</span>
          <strong>{formData.department || "-"}</strong>
        </div>

        <div className="review-row">
          <span><PersonVcard /> {t.doctor}</span>
          <strong>{formData.doctor || (language === "TH" ? "ให้ระบบเลือกให้" : "Auto selected")}</strong>
        </div>

      </div>

      <h5 className="mt-3 mb-2">{t.patientInfo}</h5>
      <div className="review-sec">

        <div className="review-row">
          <span>{t.name}</span>
          <strong>{formData.prefix} {formData.firstName} {formData.lastName}</strong>
        </div>

        <div className="review-row">
          <span>{t.phone}</span>
          <strong>{formData.phone}</strong>
        </div>

        <div className="review-row">
          <span>{t.email}</span>
          <strong>{formData.email}</strong>
        </div>

        <div className="review-row">
          <span>{t.symptoms}</span>
          <strong>{formData.symptoms || "-"}</strong>
        </div>

        {formData.medicalFileName && (
          <div className="review-row">
            <span><FileEarmarkCheck /> {t.viewMedic}</span>
            <strong className="text-success">{formData.medicalFileName}</strong>
          </div>
        )}

      </div>

      <div className="d-flex justify-content-between mt-4">

        <button className="btn-modern-alt" onClick={prev}>
          {language === "TH" ? "← ย้อนกลับ" : "← Back"}
        </button>

        <button
          className="btn-confirm"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading
            ? (language === "TH" ? "กำลังส่ง..." : "Submitting...")
            : (language === "TH" ? "ยืนยันการนัดหมาย" : "Confirm Appointment")}
        </button>

      </div>
    </div>
  );
};

export default Step3;
