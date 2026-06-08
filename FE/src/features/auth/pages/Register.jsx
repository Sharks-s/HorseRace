import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./RegisterPage.css";

const RegisterPage = () => {
  // Giả định hook useAuth của bạn có hỗ trợ thêm role hoặc bạn có thể tự quản lý bằng useState
  const {
    username,
    setUsername,
    email,
    setEmail,
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
                Hệ Thống Quản Lý Giải Đua Số Hóa.
              </h1>
              <p className="register-brand-desc">
                Tạo tài khoản để theo dõi giải đấu, xác nhận email và truy cập
                đúng vai trò trong hệ thống.
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
              Chỉ cần username, email và mật khẩu. Link xác nhận sẽ được gửi
              ngay sau khi tạo tài khoản.
            </p>

            <div className="register-info-banner">
              Tài khoản mới sẽ ở trạng thái chờ xác nhận email trước khi kích
              hoạt.
            </div>

            {/* Bổ sung tham số role vào submit nếu hook useAuth của bạn có xử lý nó */}
            <form onSubmit={(e) => handleRegisterSubmit(e, role)}>
              <div className="register-input-group">
                <label className="register-label">Tên đăng nhập</label>
                <input
                  type="text"
                  placeholder="horseowner123"
                  className="register-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  autoComplete="username"
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
                  autoComplete="email"
                  required
                />
              </div>

              {/* BỔ SUNG: Chọn vai trò đăng ký theo đúng yêu cầu phân quyền SRS */}
              <div className="register-input-group">
                <label className="register-label">
                  Bạn tham gia với vai trò
                </label>
                <select
                  className="register-input register-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="SPECTATOR">Spectator</option>
                  <option value="HORSE_OWNER">Horse Owner</option>
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
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
                <p className="register-input-hint">
                  Mật khẩu tối thiểu 8 ký tự.
                </p>
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
