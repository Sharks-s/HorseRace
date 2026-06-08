import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./LoginPage.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
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
        <section className="login-visual-pane">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsEgMuszQnoXwKOiqNHdOHjC-2usZuTXzTuWciTVehNeDBItfYlBvWPmurH165aiJybVRW3T_ltW3p-P7Ox3JrQRfZ0NROKpALWU7TwAE0FzfBtoGYftwiUJGkdO80XYNREwi-wIPS0xtNgZff7Hz7bJ3HCCSRQwtfLEveopF4d38a8GqiXe1bzWVoSHHyYVK10jAPsHzLZjng5RU_8G7xSJQZQfYQZ7xEZdllL-q88beFKecpeLQE82hSTfnxLDw-DkzjBq-BEA"
            alt="Prestigious horse racing action"
            className="login-bg-image"
          />
          <div className="login-overlay">
            <div className="login-brand-block">
              <div className="login-brand-logo-row">
                <span className="material-symbols-outlined login-brand-icon">
                  speed
                </span>
                <h1 className="login-brand-title">HorseRace</h1>
              </div>
              <p className="login-brand-desc">Digital Tournament Management</p>
            </div>
            <div className="login-brand-divider" />
          </div>
        </section>

        <section className="login-form-pane">
          <div className="login-mobile-brand">
            <span className="material-symbols-outlined login-mobile-icon">
              speed
            </span>
            <h2 className="login-mobile-title">HorseRace</h2>
          </div>

          <div className="login-form-container">
            <h2 className="login-title">Login</h2>
            <p className="login-subtitle">Access your stable and racing stats</p>

            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="login-input-group">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrap">
                  <span className="material-symbols-outlined login-input-icon">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="name@stable.com"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <div className="login-password-label-row">
                  <label className="login-label">Password</label>
                  <a href="#" className="login-forgot-password">
                    Forgot Password?
                  </a>
                </div>
                <div className="login-input-wrap">
                  <span className="material-symbols-outlined login-input-icon">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="login-visibility-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Login"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <div className="login-register-prompt">
              <p>
                Don't have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                  className="login-register-link"
                >
                  Sign Up
                </a>
              </p>
            </div>

            <div className="login-security-badge">
              <span className="material-symbols-outlined login-security-icon">
                verified_user
              </span>
              <span>JWT Security Active</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
