// ✅ src/utils/emailAppointmentService.js
import emailjs from "@emailjs/browser";

// EmailJS Config
const SERVICE_ID = "service_aywc4hm";
const TEMPLATE_ID = "template_ky4mlic";
const PUBLIC_KEY = "Xh29AgoheT_YF8zSz";

/**
 * ส่งอีเมลไปยังโรงพยาบาล (รองรับตัวแปรใน Template)
 */
export async function sendAppointmentEmailToDoctor(ap) {
  const payload = {
    doctor_email: ap.doctor_email || "",
    doctor_name: ap.doctor_name || "-",

    patient_fullname: ap.patient_fullname || "-",
    patient_phone: ap.patient_phone || "-",
    patient_email: ap.patient_email || "-",

    department: ap.department || "-",

    preferred_date: ap.preferred_date || "-",
    preferred_time: ap.preferred_time || "-",

    backup_date: ap.backup_date || "-",
    backup_time: ap.backup_time || "-",

    symptoms: ap.symptoms || "-",


    custom_message: ap.custom_message || ""
  };

  console.log("📨 EmailJS Payload:", payload);

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      payload,
      PUBLIC_KEY
    );

    console.log("📩 Email sent:", result.text);
    return true;
  } catch (err) {
    console.error("❌ EmailJS Error:", err);
    throw err;
  }
}
