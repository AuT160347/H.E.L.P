import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../datas/acc"; // เช็ค path ให้ถูกนะครับ
import Swal from "sweetalert2";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();

  if (!user) {
    // แจ้งเตือนก่อนดีดกลับ
    Swal.fire({
      icon: 'warning',
      title: 'กรุณาเข้าสู่ระบบ',
      text: 'คุณต้องเข้าสู่ระบบก่อนใช้งานหน้านี้',
      timer: 2000,
      showConfirmButton: false
    });

    // ถ้าไม่มี User ให้เด้งไปหน้า Login (สมมติว่า path คือ "/")
    return <Navigate to="/" replace />;
  }

  // ถ้ามี User ให้แสดงหน้านั้นๆ ตามปกติ
  return children;
};

export default ProtectedRoute;