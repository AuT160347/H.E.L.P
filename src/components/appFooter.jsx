import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Instagram, Line, EnvelopeFill, TelephoneFill, GeoAltFill } from "react-bootstrap-icons";
import { LanguageContext } from "./LanguageContext";
import './addFooter.css';
import { Link } from "react-router-dom";
const appFooter = () => {
    const { language } = useContext(LanguageContext); 
  const text = {
    TH: {
      about: "เกี่ยวกับเรา",
      quickLinks: "ลิงก์ด่วน",
      contact: "ติดต่อเรา",
      follow: "ติดตามเรา",
      description:
        "เว็บไซต์ H.E.L.P เป็นระบบช่วยเหลือด้านสุขภาพออนไลน์ ที่ช่วยให้คุณสามารถนัดหมายและพูดคุยกับแพทย์ได้สะดวกทุกที่ทุกเวลา",
      home: "หน้าหลัก",
      date: "นัดหมาย",
      chat: "แชทกับแพทย์",
      history: "ประวัติการรักษา",
      help: "ช่วยเหลือ",
      copyright: "สงวนลิขสิทธิ์ทั้งหมด",
    },
    EN: {
      about: "About Us",
      quickLinks: "Quick Links",
      contact: "Contact Us",
      follow: "Follow Us",
      description:
        "H.E.L.P is an online healthcare system that allows you to book appointments and chat with doctors anytime, anywhere.",
      home: "Home",
      date: "Appointments",
      chat: "Chat with Doctor",
      history: "Medical History",
      help: "Help",
      copyright: "All rights reserved.",
    },
  };
    return (
  <footer className="bg-dark text-light pt-5 pb-3">
    <Container>
      <Row className="mb-4">
        {/* คอลัมน์ 1 - เกี่ยวกับ */}
        <Col md={4} className="mb-4">
          <h5 className="fw-bold mb-3">{text[language].about}</h5>
          <p className="small">{text[language].description}</p>
        </Col>

        {/* คอลัมน์ 2 - ลิงก์ด่วน */}
        <Col md={3} className="mb-4">
          <h5 className="fw-bold mb-3">{text[language].quickLinks}</h5>
          <ul className="list-unstyled small">
            <li><Link to={'home'} className="text-light text-decoration-none">{text[language].home}</Link></li>
            <li><Link to={'appointment'} className="text-light text-decoration-none">{text[language].date}</Link></li>
            <li><Link to={'chat'} className="text-light text-decoration-none">{text[language].chat}</Link></li>
            <li><Link to={'history'} className="text-light text-decoration-none">{text[language].history}</Link></li>
            {/* <li><Link to={'help'} className="text-light text-decoration-none">{text[language].help}</Link></li> */}
          </ul>
        </Col>

        {/* คอลัมน์ 3 - ติดต่อเรา */}
        <Col md={3} className="mb-4">
          <h5 className="fw-bold mb-3">{text[language].contact}</h5>
          <ul className="list-unstyled small">
            <li><TelephoneFill className="me-2" /> 02-123-4567</li>
            <li><EnvelopeFill className="me-2" /> healthqueueproject@gmail.com</li>
          </ul>
        </Col>

        {/* คอลัมน์ 4 - โซเชียล */}
        <Col md={2} className="mb-4 text-md-end">
          <h5 className="fw-bold mb-3">{text[language].follow}</h5>
          <div className="d-flex justify-content-md-end gap-3">
            <a href="#"><Facebook color="white" size={20} /></a>
            <a href="#"><Instagram color="white" size={20} /></a>
            <a href="#"><Line color="white" size={20} /></a>
          </div>
        </Col>
      </Row>

      <hr className="border-light" />

      <Row>
        <Col className="text-center small">
          © {new Date().getFullYear()} H.E.L.P | {text[language].copyright}
        </Col>
      </Row>
    </Container>
  </footer>
);

}

export default appFooter;