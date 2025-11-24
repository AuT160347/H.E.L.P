import { useState, useContext } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { LanguageContext } from "../components/LanguageContext";

// APIs
const API_USER = "https://691205be52a60f10c8205121.mockapi.io/Users";
const API_TH = "https://6913645df34a2ff1170bd0d7.mockapi.io/TH";
const API_EN = "https://6913645df34a2ff1170bd0d7.mockapi.io/EN";

// TH list
const departmentsTH = [
  "ทันตกรรมทั่วไป", "ทันตกรรม", "หู คอ จมูก", "อายุรกรรมประสาท",
  "อายุรกรรม-ประกันสังคม", "ศัลยกรรมกระดูกและข้อ", "ตา", "อายุรกรรมโรคเลือด",
  "อายุรกรรมเด็ก", "เวชศาสตร์ฟื้นฟู", "อายุรกรรมหัวใจ", "ศัลยกรรมทั่วไป",
  "ระบบประสาท", "ผิวหนัง", "ทางเดินอาหาร", "กระดูกและข้อ", "ทางเดินปัสสาวะ",
  "นิติเวช", "ฉุกเฉิน", "อายุรกรรม", "ปอด", "ศัลยกรรมกระดูก", "นรีเวช",
  "ภูมิแพ้", "จิตเวช", "จักษุ", "คลินิกหัวใจ", "Telecare", "Premium walk in",
  "เคมีบำบัด", "โรคติดเชื้อ", "โรคไต"
];

// EN list
const departmentsEN = [
  "General Dentistry", "Dentistry", "ENT", "Neurology",
  "Internal Medicine – Social Security", "Orthopedic Surgery", "Ophthalmology",
  "Hematology", "Pediatrics", "Rehabilitation", "Cardiology", "General Surgery",
  "Neurology", "Dermatology", "Gastroenterology", "Orthopedics", "Urology",
  "Forensic Medicine", "Emergency", "Internal Medicine", "Pulmonology",
  "Orthopedic Surgery", "Gynecology", "Allergy", "Psychiatry",
  "Ophthalmology Clinic", "Cardiology Clinic", "Telecare Social Security",
  "Premium walk in", "Chemotherapy", "Infectious Disease", "Nephrology"
];

// TH → EN mapping
const departmentMap = Object.fromEntries(
  departmentsTH.map((th, i) => [th, departmentsEN[i]])
);

function AddDoctorPage() {
  const { language, text } = useContext(LanguageContext);
  const t = text[language].addDoctor;

  const [doctor, setDoctor] = useState({
    firstnameTH: "",
    lastnameTH: "",
    firstnameEN: "",
    lastnameEN: "",
    dept: "",
    idCard: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
  });

  const [workday, setWorkday] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  // Correct day order
  const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [filteredDept, setFilteredDept] = useState([]);
  const [showDeptList, setShowDeptList] = useState(false);
  const [loading, setLoading] = useState(false);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));

    if (name === "dept") {
      const results = departmentsTH.filter((d) =>
        d.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDept(results);
      setShowDeptList(true);
    }
  };

  const selectDept = (value) => {
    setDoctor((prev) => ({ ...prev, dept: value }));
    setShowDeptList(false);
  };

  const toggleWorkday = (day) => {
    setWorkday((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !doctor.firstnameTH ||
      !doctor.lastnameTH ||
      !doctor.firstnameEN ||
      !doctor.lastnameEN ||
      !doctor.dept ||
      !doctor.email ||
      !doctor.idCard ||
      !doctor.dob ||
      !doctor.gender
    ) {
      Swal.fire("⚠️", t.required, "warning");
      return;
    }

    try {
      setLoading(true);

      // Username: firstname.lastname (EN)
      const username = `${doctor.firstnameEN}.${doctor.lastnameEN}`
        .replace(/\s+/g, "")
        .toLowerCase();

      // Create doctor account
      const newAcc = await axios.post(API_USER, {
        username,
        password: "doctor123",
        email: doctor.email,
        role: "doctor",
        approved: true,
        verified: true,
        rejected: false,
      });

      // Map TH → EN for department
      const deptTH = doctor.dept.trim();
      const deptEN = departmentMap[deptTH] || deptTH;

      // Full names
      const fullNameTH = `${doctor.firstnameTH} ${doctor.lastnameTH}`;
      const fullNameEN = `${doctor.firstnameEN} ${doctor.lastnameEN}`;

      // Save TH version
      await axios.post(API_TH, {
        name: fullNameTH,
        department: deptTH,
        ...workday,
        firstname: doctor.firstnameTH,
        lastname: doctor.lastnameTH,
        specialty: deptTH,
        idCard: doctor.idCard,
        dob: doctor.dob,
        gender: doctor.gender,
        email: doctor.email,
        phone: doctor.phone,
        account_id: newAcc.data.id,
      });

      // Save EN version
      await axios.post(API_EN, {
        name: fullNameEN,
        department: deptEN,
        ...workday,
        firstname: doctor.firstnameEN,
        lastname: doctor.lastnameEN,
        specialty: deptEN,
        idCard: doctor.idCard,
        dob: doctor.dob,
        gender: doctor.gender,
        email: doctor.email,
        phone: doctor.phone,
        account_id: newAcc.data.id,
      });

      Swal.fire("✅", t.success, "success");

      // Reset form
      setDoctor({
        firstnameTH: "",
        lastnameTH: "",
        firstnameEN: "",
        lastnameEN: "",
        dept: "",
        idCard: "",
        dob: "",
        gender: "",
        email: "",
        phone: "",
      });

      setWorkday({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      });
    } catch (err) {
      Swal.fire("❌ Error", err.message, "error");
    }

    setLoading(false);
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-lg rounded">
        <h3 className="text-center mb-4 text-primary fw-bold">{t.title}</h3>

        <Form onSubmit={handleSubmit}>
          {/* THAI SECTION */}
          <h5 className="fw-bold">{t.thaiSection}</h5>
          <Form.Control
            className="my-2"
            placeholder={t.firstnameTH}
            name="firstnameTH"
            value={doctor.firstnameTH}
            onChange={handleChange}
          />
          <Form.Control
            className="mb-3"
            placeholder={t.lastnameTH}
            name="lastnameTH"
            value={doctor.lastnameTH}
            onChange={handleChange}
          />

          {/* ENGLISH SECTION */}
          <h5 className="fw-bold mt-4">{t.engSection}</h5>
          <Form.Control
            className="my-2"
            placeholder={t.firstnameEN}
            name="firstnameEN"
            value={doctor.firstnameEN}
            onChange={handleChange}
          />
          <Form.Control
            className="mb-3"
            placeholder={t.lastnameEN}
            name="lastnameEN"
            value={doctor.lastnameEN}
            onChange={handleChange}
          />

          {/* ID CARD */}
          <h5 className="fw-bold mt-4">{t.idCard}</h5>
          <Form.Control
            className="mb-3"
            placeholder={t.idCard}
            name="idCard"
            value={doctor.idCard}
            onChange={handleChange}
          />

          {/* DOB */}
          <h5 className="fw-bold mt-4">{t.dob}</h5>
          <Form.Control
            type="date"
            className="mb-3"
            name="dob"
            value={doctor.dob}
            onChange={handleChange}
          />

          {/* GENDER */}
          <h5 className="fw-bold mt-4">{t.gender}</h5>
          <Form.Select
            className="mb-3"
            name="gender"
            value={doctor.gender}
            onChange={handleChange}
          >
            <option value="">{t.gender}</option>
            <option value="ชาย">{t.genderMale}</option>
            <option value="หญิง">{t.genderFemale}</option>
            <option value="อื่นๆ">{t.genderOther}</option>
          </Form.Select>

          {/* WORKDAYS */}
          <h5 className="fw-bold mt-4">{t.workdays}</h5>

          <Row className="mb-3">
            {dayOrder.map((day) => (
              <Col xs={6} md={4} key={day}>
                <Form.Check
                  type="checkbox"
                  label={text[language].weekdays[day]}
                  checked={workday[day]}
                  onChange={() => toggleWorkday(day)}
                />
              </Col>
            ))}
          </Row>

          {/* DEPARTMENT AUTOCOMPLETE */}
          <h5 className="fw-bold mt-4">{t.department}</h5>

          <div style={{ position: "relative" }}>
            <Form.Control
              placeholder={t.department}
              name="dept"
              value={doctor.dept}
              onChange={handleChange}
              onFocus={() => setShowDeptList(true)}
            />

            {showDeptList && filteredDept.length > 0 && (
              <ul
                className="border rounded mt-1 p-0"
                style={{
                  listStyle: "none",
                  position: "absolute",
                  background: "white",
                  width: "100%",
                  maxHeight: "220px",
                  overflowY: "auto",
                  zIndex: 10,
                }}
              >
                {filteredDept.map((item) => (
                  <li
                    key={item}
                    className="p-2"
                    style={{ cursor: "pointer" }}
                    onMouseDown={() => selectDept(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* EMAIL */}
          <Form.Control
            className="mt-3 mb-3"
            placeholder={t.email}
            name="email"
            value={doctor.email}
            onChange={handleChange}
          />

          {/* PHONE */}
          <Form.Control
            className="mb-4"
            placeholder={t.phone}
            name="phone"
            value={doctor.phone}
            onChange={handleChange}
          />

          {/* SUBMIT */}
          <Button type="submit" disabled={loading} className="w-100 btn btn-primary">
            {loading ? t.saving : t.submit}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AddDoctorPage;
