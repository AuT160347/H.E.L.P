// src/pages/step1.jsx
import { useContext, useEffect, useMemo } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { LanguageContext } from "../components/LanguageContext";
import { Calendar3, Clock, Hospital, PersonBadge } from "react-bootstrap-icons";

const timeSlots = [
  "09:00","09:30","10:00","10:30","11:00",
  "11:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00",
];

const normalize = (str) => (str || "").trim().replace(/\s+/g, "");

const Step1 = ({ formData, setFormData, doctors, next }) => {
  const { language, text } = useContext(LanguageContext);
  const t = text[language].step1;

  const todayStr = new Date().toISOString().split("T")[0];

  const doctorsWithName = useMemo(() => {
    if (!Array.isArray(doctors)) return [];
    return doctors.map((d) => ({
      ...d,
      displayName: d.name || d.nameTH || d.nameEN || (language === "th" ? "ไม่ทราบชื่อ" : "Unknown"),
    }));
  }, [doctors, language]);

  const hospitals = useMemo(() => {
    return [...new Set(doctorsWithName.map((d) => normalize(d.hospital)))];
  }, [doctorsWithName]);

  const departments = useMemo(() => {
    if (!formData.hospital) return [];
    return [
      ...new Set(
        doctorsWithName
          .filter((d) => normalize(d.hospital) === normalize(formData.hospital))
          .map((d) => normalize(d.departmentTH))
      ),
    ];
  }, [formData.hospital, doctorsWithName]);

  const doctorsFiltered = useMemo(() => {
    if (!formData.hospital || !formData.department) return [];
    return doctorsWithName.filter(
      (d) =>
        normalize(d.hospital) === normalize(formData.hospital) &&
        normalize(d.departmentTH) === normalize(formData.department)
    );
  }, [formData.hospital, formData.department, doctorsWithName]);

  useEffect(() => {
    if (formData.doctorMode === "auto" && doctorsFiltered.length > 0) {
      const randomDoc =
        doctorsFiltered[Math.floor(Math.random() * doctorsFiltered.length)];

      setFormData((prev) => ({
        ...prev,
        doctor: "",
        doctorId: randomDoc.id,
      }));
    }
  }, [formData.doctorMode, doctorsFiltered]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "hospital") {
      setFormData((prev) => ({
        ...prev,
        department: "",
        doctor: "",
        doctorId: "",
      }));
    }

    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        doctor: "",
        doctorId: "",
      }));
    }
  };

  const handleNext = () => {
    if (!formData.preferredDate) return alert(t.selectMainDate);
    if (!formData.preferredTime) return alert(t.selectTime);
    if (!formData.hospital) return alert(t.selectHospital);
    if (!formData.department) return alert(t.selectDepartment);

    next();
  };

  return (
    <div className="step-card">
      <h4 className="step-title">{t.header}</h4>

      <Row className="g-3">

        <Col md={6}>
          <Form.Label>{t.preferredDate}</Form.Label>
          <div className="input-icon">
            <Calendar3 className="input-icon-left" />
            <Form.Control
              type="date"
              name="preferredDate"
              min={todayStr}
              value={formData.preferredDate}
              onChange={handleChange}
            />
          </div>
        </Col>

        <Col md={6}>
          <Form.Label>{t.backupDate}</Form.Label>
          <div className="input-icon">
            <Calendar3 className="input-icon-left" />
            <Form.Control
              type="date"
              name="backupDate"
              min={todayStr}
              value={formData.backupDate}
              onChange={handleChange}
            />
          </div>
        </Col>

        <Col md={6}>
          <Form.Label>{t.preferredTime}</Form.Label>
          <div className="input-icon">
            <Clock className="input-icon-left" />
            <Form.Select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
            >
              <option value="">{t.selectTime}</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Form.Select>
          </div>
        </Col>

        <Col md={6}>
          <Form.Label>{t.backupTime}</Form.Label>
          <div className="input-icon">
            <Clock className="input-icon-left" />
            <Form.Select
              name="backupTime"
              value={formData.backupTime}
              onChange={handleChange}
            >
              <option value="">{t.selectTime}</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Form.Select>
          </div>
        </Col>

        <Col md={12}>
          <Form.Label>{t.hospital}</Form.Label>
          <div className="input-icon">
            <Hospital className="input-icon-left" />
            <Form.Select
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
            >
              <option value="">{t.hospital}</option>

              {hospitals.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </Form.Select>
          </div>
        </Col>

        {formData.hospital && (
          <Col md={12}>
            <Form.Label>{t.department}</Form.Label>
            <div className="input-icon">
              <PersonBadge className="input-icon-left" />
              <Form.Select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">{t.department}</option>

                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Form.Select>
            </div>
          </Col>
        )}

        {formData.department && (
          <Col md={12}>
            <Form.Label>{t.doctor}</Form.Label>

            <div className="doctor-mode">
              <Form.Check
                type="radio"
                value="auto"
                name="doctorMode"
                label={t.auto}
                checked={formData.doctorMode === "auto"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, doctorMode: e.target.value }))
                }
              />

              <Form.Check
                type="radio"
                value="manual"
                name="doctorMode"
                label={t.manual}
                checked={formData.doctorMode === "manual"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, doctorMode: e.target.value }))
                }
              />
            </div>

            {formData.doctorMode === "manual" && (
              <Form.Select
                className="mt-2"
                name="doctor"
                value={formData.doctor}
                onChange={(e) => {
                  const chosen = e.target.value;
                  const found = doctorsFiltered.find(
                    (doc) => normalize(doc.displayName) === normalize(chosen)
                  );

                  setFormData((prev) => ({
                    ...prev,
                    doctor: chosen,
                    doctorId: found?.id || "",
                  }));
                }}
              >
                <option value="">{t.doctor}</option>

                {doctorsFiltered.map((doc) => (
                  <option key={doc.id} value={doc.displayName}>
                    {doc.displayName}
                  </option>
                ))}
              </Form.Select>
            )}
          </Col>
        )}

      </Row>

      <div className="d-flex justify-content-end mt-4">
        <button className="btn-modern" onClick={handleNext}>
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default Step1;
