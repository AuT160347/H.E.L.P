import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { LanguageContext } from "../../components/LanguageContext";
import { getCurrentUser } from "../../datas/acc";

const HOSPITAL_API = "https://691205be52a60f10c8205121.mockapi.io/hospital";

export default function EditHospitalPage() {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation(); // hospital object from previous page

  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState({
    hospitalNameTH: "",
    hospitalNameEN: "",
    hospitalIMG: "",
    email: "",
    phone: "",
  });

  // ==============================
  // Check Auth
  // ==============================
  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "admin") {
      navigate("/home");
      return;
    }

    loadHospital();
  }, []);

  // ==============================
  // Load Hospital by ID
  // ==============================
  const loadHospital = async () => {
    try {
      setLoading(true);

      // ถ้ามีข้อมูลมาจาก state (เร็วกว่า)
      if (state?.hospital) {
        setHospital(state.hospital);
        setLoading(false);
        return;
      }

      // ถ้าไม่มี state → ดึงจาก API
      const res = await axios.get(`${HOSPITAL_API}/${id}`);
      setHospital(res.data);
    } catch (err) {
      Swal.fire("Error", "ไม่สามารถโหลดข้อมูลโรงพยาบาลได้", "error");
      navigate("/dashboard/hospitals");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Handle Change
  // ==============================
  const handleChange = (e) => {
    setHospital({
      ...hospital,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // Save Hospital
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        hospitalNameTH: hospital.hospitalNameTH,
        hospitalNameEN: hospital.hospitalNameEN,
        hospitalIMG: hospital.hospitalIMG,
        email: hospital.email,
        phone: hospital.phone,
      };

      await axios.put(`${HOSPITAL_API}/${id}`, payload);

      Swal.fire("สำเร็จ", "แก้ไขข้อมูลเรียบร้อยแล้ว", "success");
      navigate("/dashboard/hospitals");
    } catch (err) {
      Swal.fire("Error", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button
  className="btn btn-light mb-3"
  onClick={() =>
    navigate(`/dashboard/hospitals/`, {
      state: { hospital: hospital },
    })
  }
>
  ← {language === "TH" ? "กลับ" : "Back"}
</button>


      <h2 className="fw-bold mb-4">
        {language === "TH" ? "แก้ไขโรงพยาบาล" : "Edit Hospital"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* TH Name */}
        <div className="mb-3">
          <label className="form-label">
            {language === "TH" ? "ชื่อโรงพยาบาล (ไทย)" : "Hospital Name (TH)"}
          </label>
          <input
            type="text"
            name="hospitalNameTH"
            className="form-control"
            value={hospital.hospitalNameTH}
            onChange={handleChange}
            required
          />
        </div>

        {/* EN Name */}
        <div className="mb-3">
          <label className="form-label">
            {language === "TH" ? "ชื่อโรงพยาบาล (อังกฤษ)" : "Hospital Name (EN)"}
          </label>
          <input
            type="text"
            name="hospitalNameEN"
            className="form-control"
            value={hospital.hospitalNameEN}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={hospital.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="form-label">
            {language === "TH" ? "เบอร์โทร" : "Phone"}
          </label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={hospital.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image */}
        <div className="mb-3">
          <label className="form-label">
            {language === "TH" ? "URL รูปภาพโรงพยาบาล" : "Image URL"}
          </label>
          <input
            type="text"
            name="hospitalIMG"
            className="form-control"
            value={hospital.hospitalIMG}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          {language === "TH" ? "บันทึกการแก้ไข" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
