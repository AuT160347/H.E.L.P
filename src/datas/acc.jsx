// 📌 src/datas/acc.js
import axios from "axios";
import {
  sendVerificationEmail,
  sendRejectEmail,
} from "../utils/emailService";

const API_URL = "https://691205be52a60f10c8205121.mockapi.io/Users";

// ดึงข้อมูลผู้ใช้ทั้งหมด (ใช้ในหน้าแอดมิน)
export async function getUsers() {
  const res = await axios.get(API_URL);
  return res.data;
}

// สมัครสมาชิก (เช็คอีเมล + ชื่อผู้ใช้ ซ้ำ)
export async function registerUser(userData) {
  const res = await axios.get(API_URL);
  const users = res.data;

  const emailExists = users.some((u) => u.email === userData.email);
  if (emailExists) throw new Error("อีเมลนี้ถูกใช้แล้ว กรุณาใช้อีเมลอื่น");

  const usernameExists = users.some((u) => u.username === userData.username);
  if (usernameExists)
    throw new Error("ชื่อผู้ใช้นี้ถูกใช้แล้ว กรุณาใช้ชื่ออื่น");

  const newUser = await axios.post(API_URL, {
    ...userData,
    role: userData.role || "patient",
    approved: false,
    verified: false,
    rejected: false,
    rejectReason: "",
  });

  return newUser.data;
}

// 🔐 เข้าสู่ระบบ
export async function loginUser(username, password) {
  try {
    const res = await axios.get(API_URL);
    const users = res.data;

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");

    // ❌ บล็อก superadmin ไม่ให้ใช้งาน
    if (user.role === "superadmin") {
      throw new Error("บัญชีนี้ถูกปิดการใช้งานแล้ว");
    }

    if (user.rejected)
      throw new Error("บัญชีนี้ถูกปฏิเสธจากผู้ดูแลระบบ");

    if (!user.approved)
      throw new Error("บัญชีนี้ยังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ");

    // ✔ บันทึกผู้ใช้ที่ล็อกอิน
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));

    return user;
  } catch (error) {
    throw error;
  }
}

// ดึงผู้ใช้ปัจจุบัน
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// อนุมัติผู้ใช้
export async function verifyUser(id) {
  const res = await axios.put(`${API_URL}/${id}`, {
    approved: true,
    verified: true,
    rejected: false,
    verifiedAt: new Date().toLocaleString("th-TH"),
  });

  await sendVerificationEmail({
    to_email: res.data.email,
    username: res.data.username,
  });

  return res.data;
}

// ปฏิเสธผู้ใช้
export async function rejectUser(id, reason) {
  const res = await axios.put(`${API_URL}/${id}`, {
    rejected: true,
    approved: false,
    verified: false,
    rejectReason: reason,
    rejectedAt: new Date().toLocaleString("th-TH"),
  });

  await sendRejectEmail({
    to_email: res.data.email,
    username: res.data.username,
    reject_reason: reason,
  });

  return res.data;
}

// ลบผู้ใช้
export async function deleteUser(id) {
  await axios.delete(`${API_URL}/${id}`);
  return true;
}

// ออกจากระบบ
export function logoutUser() {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("storage"));
}
