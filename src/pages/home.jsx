import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../components/LanguageContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import { fetchDoctor } from "../datas/dataDoctor";
import { useNavigate } from "react-router-dom";
import "../components/Carousel.css";

import Carousel from "../components/Carousel";
import PromotionCarousel from "../components/PromotionCarousel";

import doctorIcon from "/img/doctorIcons.png";
import "./home.css";

const Home = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);
  const [hospitalDoctors, setHospitalDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  // Load Hospitals
  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const response = await fetch(
          "https://691205be52a60f10c8205121.mockapi.io/hospital"
        );
        const data = await response.json();
        setHospitals(data);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load hospitals", e);
        setLoading(false);
      }
    };
    loadHospitals();
  }, []);

  // Open Hospital Modal and load doctors
  const openHospitalModal = async (hospitalObj) => {
    setSelectedHospital(hospitalObj);
    setModalShow(true);

    const data = await fetchDoctor(); // <— ไม่ต้องใส่ language แล้ว

    // Filter เฉพาะหมอจากโรงพยาบาลนี้
    const filtered = data
      .filter(
        (doc) =>
          doc.hospital === hospitalObj.hospitalNameTH ||
          doc.hospital === hospitalObj.hospitalNameEN
      )
      .slice(0, 10); // ดึงมาแค่ 10 คน

    setHospitalDoctors(filtered);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="modern-page">

      {/* ===================== HERO SECTION ===================== */}
      <div className="hero-section d-flex align-items-center">
        <Container>
          <Row className="align-items-center">

            {/* Search Box */}
            <Col xs={12} lg={6} className="mb-4 mb-lg-0">
              <div className="search-modern">
                <h2 className="search-title">
                  {language === "TH"
                    ? "ค้นหาแพทย์เฉพาะทางได้ง่ายขึ้น"
                    : "Find the Right Specialist Easily"}
                </h2>

                <div className="search-input-box">
                  <Form.Control
                    type="text"
                    placeholder={
                      language === "TH" ? "ค้นหาชื่อหมอ..." : "Search doctor..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-modern"
                  />

                  <Button
                    className="btn-modern"
                    onClick={() =>
                      navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
                    }
                  >
                    {language === "TH" ? "ค้นหา" : "Search"}
                  </Button>
                </div>

                <p className="search-helper">
                  {language === "TH"
                    ? "พิมพ์ชื่อหมอที่คุณต้องการค้นหา..."
                    : "Type the doctor’s name you want to find..."}
                </p>
              </div>
            </Col>

            {/* Carousel Side */}
            <Col xs={12} lg={6} className="d-flex justify-content-center">
              <Carousel />
            </Col>
          </Row>
        </Container>
      </div>

      {/* ===================== HOSPITAL SECTION ===================== */}
      <Container fluid className="py-5 px-4 doctor-section">
        <h3 className="section-title">
          {language === "TH" ? "โรงพยาบาลแนะนำ" : "Recommended Hospitals"}
        </h3>

        <div className="doctor-grid">
          {hospitals.map((h) => (
            <div
              key={h.id}
              className="doctor-card-modern"
              onClick={() => openHospitalModal(h)}
            >
              <img src={h.hospitalIMG} className="doctor-photo" />

              <h5 className="doctor-name">
                {language === "TH" ? h.hospitalNameTH : h.hospitalNameEN}
              </h5>
            </div>
          ))}
        </div>

        <PromotionCarousel />
      </Container>

      {/* ===================== MODAL ===================== */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {language === "TH"
              ? `หมอแนะนำจาก ${selectedHospital?.hospitalNameTH}`
              : `Recommended Doctors from ${selectedHospital?.hospitalNameEN}`}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {hospitalDoctors.length === 0 ? (
            <p className="text-center">
              {language === "TH" ? "ไม่พบรายชื่อหมอ" : "No doctors found"}
            </p>
          ) : (
            <div className="doctor-grid">
              {hospitalDoctors.map((doc) => {
                // เลือกชื่อและแผนกตามภาษา
                const displayName =
                  language === "TH" ? doc.nameTH : doc.nameEN;
                const displayDept =
                  language === "TH" ? doc.departmentTH : doc.departmentEN;

                return (
                  <div key={doc.id} className="doctor-card-modern">
                    <img src={doctorIcon} className="doctor-photo" />
                    <h5>{displayName}</h5>
                    <p>{displayDept}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            {language === "TH" ? "ปิด" : "Close"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
