import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getCurrentUser } from "../datas/acc";

export default function useSuperAdminGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "หน้านี้สำหรับ Admin เท่านั้น",
        confirmButtonText: "กลับหน้าแรก",
      }).then(() => navigate("/home"));
    }
  }, []);
}
