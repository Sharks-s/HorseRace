import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../service/auth.service";
import { toast } from "../../../shared/components/Toast"; // <-- 1. Import file toast gọi trực tiếp của bạn vào đây

export const useAuth = () => {
  // --- Các State dùng chung hoặc riêng ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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

        // <-- 2. Thay alert bằng toast.success
        toast.success(
          `Đăng nhập thành công! Chào mừng ${result.data.fullName}`,
        );

        // <-- 3. Trì hoãn chuyển trang một chút để kịp nhìn thấy Toast
        setTimeout(() => {
          if (result.data.role === "ADMIN") {
            navigate("/admin");
          } else if (result.data.role === "HORSE_OWNER") {
            navigate("/owner/horses");
          } else if (result.data.role === "JOCKEY") {
            navigate("/jockey");
          } else {
            navigate("/");
          }
        }, 1200);
      }
    } catch (error) {
      // <-- 4. Thay alert lỗi bằng toast.error
      toast.error(
        error.response?.data?.message ||
          "Đăng nhập thất bại, vui lòng kiểm tra lại!",
      );
    } finally {
      // Lưu ý: Giữ lại isLoading thích hợp để nút không bị click liên tục
      // Nếu đăng nhập thành công, nút vẫn sẽ disable cho đến khi chuyển trang (trông rất chuyên nghiệp)
      if (!localStorage.getItem("user")) {
        setIsLoading(false);
      }
    }
  };

  // --- 2. Logic Xử lý Đăng ký (Register) ---
  // --- 2. Logic Xử lý Đăng ký (Register) ---
  const handleRegisterSubmit = async (e, role) => {
    // <-- Nhận thêm tham số role từ form gửi sang
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await authService.register({
        username,
        email,
        password,
        role, // <-- Truyền thêm role vào API payload gửi lên Backend
      });

      if (result.success) {
        toast.success("Đăng ký thành công. Bạn có thể đăng nhập ngay.");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      // --- ĐOẠN MAP LỖI THÔ (PLAIN TEXT) TỪ BACKEND ---
      let errorMessage = "Đăng ký thất bại, vui lòng kiểm tra lại thông tin!";

      if (error.response && error.response.data) {
        // Nếu data trả về là Object có chứa message (đề phòng sau này đổi cấu trúc)
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        // Nếu data trả về trực tiếp là chuỗi chữ (như "Email already exists")
        else if (typeof error.response.data === "string") {
          // Bạn có thể để nguyên tiếng Anh hoặc dịch sang tiếng Việt tùy ý:
          if (error.response.data === "Username already exists") {
            errorMessage = "Username này đã được sử dụng trên hệ thống!";
          } else if (error.response.data === "Email already exists") {
            errorMessage = "Email này đã được sử dụng trên hệ thống!";
          } else {
            errorMessage = error.response.data; // Hiển thị trực tiếp chuỗi lỗi từ BE
          }
        }
      }

      toast.error(errorMessage);
      setIsLoading(false); // Tắt trạng thái loading để người dùng sửa lại form
    }
  };

  // --- Trả về tất cả các biến và hàm cho cả 2 trang sử dụng ---
  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLoginSubmit,
    handleRegisterSubmit,
    navigate,
  };
};
