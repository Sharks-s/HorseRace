import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./RegisterPage.css";

const RegisterPage = () => {
  // Giả định hook useAuth của bạn có hỗ trợ thêm role hoặc bạn có thể tự quản lý bằng useState
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    isLoading,
    handleRegisterSubmit,
    navigate,
  } = useAuth();

  // Thêm state role để quản lý việc phân quyền khi đăng ký
  const [role, setRole] = useState("SPECTATOR");

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Left Visual Pane - Đổi ảnh trường đua & nội dung thương hiệu */}
        <div className="register-visual-pane">
          <img alt="Horse Racing Track" className="register-bg-image" />
          <div className="register-overlay">
            <div>
              <div className="register-logo-area">
                <div className="register-logo-cube">HR</div>
                <span className="register-brand-name">HorseRace</span>
              </div>
              <h1 className="register-brand-title">
                Hệ Thống Quản Lý Giải Đua Ngũ Số Hóa.
              </h1>
              <p className="register-brand-desc">
                Tham gia vào hệ thống điều hành giải đấu chuyên nghiệp. Quản lý
                hồ sơ, tối ưu hóa lịch thi đấu và cập nhật kết quả thời gian
                thực (Real-time).
              </p>
            </div>

            <div className="register-badges">
              <div className="register-security-pill">
                🛡️ Mã hóa dữ liệu BCrypt
              </div>
              <div className="register-security-pill">
                🔒 Đóng gói Docker Bảo Mật
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="register-form-pane">
          <div className="register-form-container">
            <h2 className="register-title">Đăng ký tài khoản</h2>
            <p className="register-subtitle">
              Tạo tài khoản để tham gia hệ thống đua ngựa.
            </p>

            {/* Bổ sung tham số role vào submit nếu hook useAuth của bạn có xử lý nó */}
            <form onSubmit={(e) => handleRegisterSubmit(e, role)}>
              <div className="register-input-group">
                <label className="register-label">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="register-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="register-input-group">
                <label className="register-label">Email</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  className="register-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="register-input-group">
                <label className="register-label">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="090 123 4567"
                  className="register-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              {/* BỔ SUNG: Chọn vai trò đăng ký theo đúng yêu cầu phân quyền SRS */}
              <div className="register-input-group">
                <label className="register-label">
                  Bạn tham gia với vai trò
                </label>
                <select
                  className="register-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                  }}
                >
                  <option value="SPECTATOR">
                    Spectator (Khán giả xem lịch & kết quả)
                  </option>
                  <option value="HORSE_OWNER">
                    Horse Owner (Chủ ngựa đăng ký thi đấu)
                  </option>
                  <option value="JOCKEY">
                    Jockey (Người cưỡi ngựa điều khiển)
                  </option>
                </select>
              </div>

              <div className="register-input-group">
                <label className="register-label">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="register-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Tạo tài khoản hệ thống"}{" "}
                <span>→</span>
              </button>
            </form>

            {/* Chuyển sang Đăng nhập */}
            <div className="register-login-prompt">
              <p style={{ margin: 0 }}>
                Đã có tài khoản?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                  className="register-login-link"
                >
                  Đăng nhập tại đây
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
