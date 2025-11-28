import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchDoctor } from "../datas/dataDoctor";
import { LanguageContext } from "../components/LanguageContext";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Search.css"

import doctorIcon from "/img/doctorIcons.png";

const SearchPage = () => {
  const { language } = useContext(LanguageContext);
  const { search } = useLocation();
  const navigate = useNavigate();

  const queryParam = new URLSearchParams(search).get("query") || "";
  const [query, setQuery] = useState(queryParam);

  const [allDoctors, setAllDoctors] = useState([]);
  const [results, setResults] = useState([]);

  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterHospital, setFilterHospital] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  // โหลดหมอทั้งหมด

  useEffect(() => {
    const loadAll = async () => {
      const data = await fetchDoctor();
      setAllDoctors(data);
    };
    loadAll();
  }, []);


  // ค้นหา + Filter

  useEffect(() => {
    const load = async () => {
      const data = await fetchDoctor();

      const q = queryParam.toLowerCase();

      let filtered = data.filter((doc) => {
        const name = language === "TH" ? doc.nameTH : doc.nameEN;
        const dept =
          language === "TH" ? doc.departmentTH : doc.departmentEN;

        return (
          name.toLowerCase().includes(q) ||
          dept.toLowerCase().includes(q) ||
          doc.hospital.toLowerCase().includes(q)
        );
      });

      // Filter แผนก
      if (filterDepartment) {
        filtered = filtered.filter(
          (doc) =>
            (language === "TH" ? doc.departmentTH : doc.departmentEN) ===
            filterDepartment
        );
      }

      // Filter โรงพยาบาล
      if (filterHospital) {
        filtered = filtered.filter((doc) => doc.hospital === filterHospital);
      }

      setResults(filtered);
    };

    load();
  }, [queryParam, language, filterDepartment, filterHospital]);

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  // Dropdown List (แสดงตามภาษา)
  const hospitals = [...new Set(allDoctors.map((d) => d.hospital))];

  const departments = [
    ...new Set(
      allDoctors.map((d) =>
        language === "TH" ? d.departmentTH : d.departmentEN
      )
    ),
  ];


  return (
    <Container className="py-5">

      {/* SEARCH BOX */}
      <div
        className="shadow p-4 rounded mb-4"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <h3 className="mb-3 text-center">
          {language === "TH" ? "ค้นหาหมอ" : "Search Doctor"}
        </h3>

        <div className="d-flex mb-3">
          <Form.Control
            type="text"
            placeholder={
              language === "TH"
                ? "ค้นหาชื่อหมอ / แผนก / โรงพยาบาล..."
                : "Search name / department / hospital..."
            }
            className="me-2"
            size="lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button size="lg" onClick={handleSearch}>
            {language === "TH" ? "ค้นหา" : "Search"}
          </Button>
        </div>

        {/* FILTERS */}
        <div className="d-flex gap-2">
          {/* DEPARTMENTS */}
          <Form.Select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">
              {language === "TH" ? "เลือกแผนก" : "Select Department"}
            </option>
            {departments.map((dep, idx) => (
              <option key={idx} value={dep}>
                {dep}
              </option>
            ))}
          </Form.Select>

          {/* HOSPITALS */}
          <Form.Select
            value={filterHospital}
            onChange={(e) => setFilterHospital(e.target.value)}
          >
            <option value="">
              {language === "TH" ? "เลือกโรงพยาบาล" : "Select Hospital"}
            </option>
            {hospitals.map((hos, idx) => (
              <option key={idx} value={hos}>
                {hos}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {/* RESULTS */}
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
          {results.map((doc) => {
            const displayName =
              language === "TH" ? doc.nameTH : doc.nameEN;
            const displayDept =
              language === "TH" ? doc.departmentTH : doc.departmentEN;

            return (
              <div
                key={doc.id}
                className="doctor-card"
                onClick={() => {
                  setSelectedDoctor(doc);
                  setModalShow(true);
                }}
              >
                <img src={doctorIcon} className="doctor-image" />

                <h5 className="doc-title">{displayName}</h5>

                <p className="doc-dept">{displayDept}</p>

                <p className="doc-hospital">{doc.hospital}</p>

              </div>
            );
          })}
        </div>
      )}

      {/* DOCTOR MODAL */}
      {selectedDoctor && (
  <Modal show={modalShow} onHide={() => setModalShow(false)} centered size="lg">
    <div className="custom-modal-content">
      <div className="row g-1">

        {/* LEFT IMAGE */}
        <div className="col-md-5">
          <img src={doctorIcon} className="modal-left-img" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-md-7">
          <div className="modal-body-custom">

            {/* TITLE */}
            <h3 className="mb-3">
              {language === "TH" ? "ข้อมูลหมอ" : "Doctor Details"}
            </h3>

            {/* DOCTOR NAME */}
            <h4 className="fw-bold">
              {language === "TH" ? selectedDoctor.nameTH : selectedDoctor.nameEN}
            </h4>

            {/* DEPARTMENT */}
            <p className="text-muted">
              {language === "TH"
                ? selectedDoctor.departmentTH
                : selectedDoctor.departmentEN}
            </p>

            {/* HOSPITAL */}
            <p className="fw-bold">
              {language === "TH" ? "โรงพยาบาล:" : "Hospital:"}{" "}
              <span className="text-primary">{selectedDoctor.hospital}</span>
            </p>

            <hr />

            {/* AVAILABLE DAYS */}
            <h5 className="mb-3">
              {language === "TH" ? "วันออกตรวจ" : "Available Days"}
            </h5>

            <div className="d-flex flex-wrap justify-content-center mb-3">
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
                  className="available-day-box"
                  style={{
                    backgroundColor: selectedDoctor[day.key]
                      ? "#d1f7c4"
                      : "#f2f2f2",
                    border: selectedDoctor[day.key]
                      ? "2px solid #198754"
                      : "1px solid #ccc",
                    color: selectedDoctor[day.key] ? "green" : "#777"
                  }}
                >
                  <strong>{language === "TH" ? day.th : day.en}</strong>
                  <p className="m-0">
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

  
          </div>
        </div>
      </div>
    </div>
  </Modal>
)}
        
     
    </Container>
  );
};

export default SearchPage;
