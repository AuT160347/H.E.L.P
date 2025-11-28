// ✅ src/utils/emailService.js
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_gnd0g99";

// เทมเพลตสำหรับ "อนุมัติผู้ใช้"
const TEMPLATE_APPROVE = "template_0lui3yp";

// เทมเพลตสำหรับ "ปฏิเสธผู้ใช้"
// 👉 ต้องตรงกับ Template ID ใน EmailJS
const TEMPLATE_REJECT = "template_7e1gb3n";

const PUBLIC_KEY = "5hEb1GEZd1KKFWdKt";


// ฟังก์ชันส่งอีเมล "อนุมัติผู้ใช้"
export async function sendVerificationEmail({ to_email, username }) {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_APPROVE,   // ← แก้ตรงนี้
      {
        to_email,
        username,
      },
      PUBLIC_KEY
    );
    console.log("✅ Verification email sent:", result.text);
    return true;
  } catch (err) {
    console.error("❌ EmailJS verification error:", err);
    return false;
  }
}


// ฟังก์ชันส่งอีเมล "ปฏิเสธผู้ใช้"
export async function sendRejectEmail({ to_email, username, reject_reason }) {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_REJECT,   // ← แก้ตรงนี้
      {
        to_email,
        username,
        reject_reason,
      },
      PUBLIC_KEY
    );
    console.log("📩 Reject email sent:", result.text);
    return true;
  } catch (err) {
    console.error("❌ EmailJS reject error:", err);
    return false;
  }
}
