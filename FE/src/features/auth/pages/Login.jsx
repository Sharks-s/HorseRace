import { useAuth } from "../hooks/useAuth";
import "./LoginPage.css";

const LoginPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLoginSubmit,
    navigate,
  } = useAuth();

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Visual Pane - Đổi ảnh và nội dung theo chủ đề Đua Ngựa */}
        <div className="login-visual-pane">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsEgMuszQnoXwKOiqNHdOHjC-2usZuTXzTuWciTVehNeDBItfYlBvWPmurH165aiJybVRW3T_ltW3p-P7Ox3JrQRfZ0NROKpALWU7TwAE0FzfBtoGYftwiUJGkdO80XYNREwi-wIPS0xtNgZff7Hz7bJ3HCCSRQwtfLEveopF4d38a8GqiXe1bzWVoSHHyYVK10jAPsHzLZjng5RU_8G7xSJQZQfYQZ7xEZdllL-q88beFKecpeLQE82hSTfnxLDw-DkzjBq-BEA"
            alt="Horse Racing Tournament"
            className="login-bg-image"
          />
          <div className="login-overlay">
            <div>
              <h1 className="login-brand-title">HorseRace</h1>
              <p className="login-brand-desc">
                Hệ thống quản lý giải đua ngựa toàn diện. Kết nối Ban tổ chức,
                Chủ ngựa, Jockey và Trọng tài trên một nền tảng Web Portal hiện
                đại.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="login-form-pane">
          <div className="login-form-container">
            <h2 className="login-title">Đăng nhập</h2>
            <p className="login-subtitle">
              Vui lòng đăng nhập để truy cập hệ thống theo phân quyền của bạn.
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div className="login-input-group">
                <label className="login-label">Email tài khoản</label>
                <input
                  type="email"
                  placeholder="username@domain.com"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-input-group">
                <label className="login-label">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="login-form-options">
                <label className="login-remember-me">
                  <input type="checkbox" /> <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="login-forgot-password">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? "Đang xác thực..." : "Đăng nhập hệ thống"}{" "}
                <span>→</span>
              </button>
            </form>

            <div className="login-register-prompt">
              <p style={{ margin: 0 }}>
                Bạn là thành viên mới?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                  className="login-register-link"
                >
                  Đăng ký tài khoản
                </a>
              </p>
            </div>

            {/* Giữ lại badge bảo mật cực kỳ ăn rơ với mục 4 (Non-Functional) trong SRS */}
            <div className="login-security-badge">
              <span>🔒 Session-based / JWT Security Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
