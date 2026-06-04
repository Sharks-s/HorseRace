import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../service/auth.service";

export const useAuth = () => {
  // --- Các State dùng chung cho Luồng Auth ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- 1. Logic Xử lý Đăng nhập (Login) ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await authService.login({ email, password });

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.data));
        alert(
          `Đăng nhập thành công! Chào mừng ${result.data.fullName || result.data.email}`,
        );

        // Điều hướng thông minh dựa trên Phân Quyền Hệ Thống trong SRS
        switch (result.data.role) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          case "HORSE_OWNER":
            navigate("/owner/horses");
            break;
          case "JOCKEY":
            navigate("/jockey/schedule");
            break;
          case "REFEREE":
            navigate("/referee/reports");
            break;
          case "SPECTATOR":
          default:
            navigate("/"); // Khán giả về Trang chủ để coi lịch đua công bố công khai
            break;
        }
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Đăng nhập thất bại, vui lòng kiểm tra lại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Logic Xử lý Đăng ký (Register) ---
  // Nhận tham số 'roleSelected' được truyền từ Form Đăng ký
  const handleRegisterSubmit = async (e, roleSelected = "SPECTATOR") => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await authService.register({
        fullName,
        email,
        password,
        phoneNumber,
        role: roleSelected, // Gửi role được chọn lên Backend để xử lý tạo tài khoản
      });

      if (result.success) {
        alert(
          `Đăng ký tài khoản thành công với vai trò: ${roleSelected}! Vui lòng đăng nhập lại.`,
        );
        navigate("/login");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Đăng ký thất bại, vui lòng kiểm tra lại thông tin!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Trả về tất cả các biến và hàm cho cả 2 trang sử dụng ---
  return {
    fullName,
    setFullName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    isLoading,
    handleLoginSubmit,
    handleRegisterSubmit,
    navigate,
  };
};
