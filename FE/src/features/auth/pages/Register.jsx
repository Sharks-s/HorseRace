import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./RegisterPage.css";

const RegisterPage = () => {
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
  const [role, setRole] = useState("SPECTATOR");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="register-shell">
      <header className="register-hero">
        <div className="register-hero-overlay">
          <div className="register-brand">
            <h1>HorseRace</h1>
            <p>Digital Tournament Management</p>
          </div>
        </div>
      </header>

      <main className="register-main">
        <section className="register-panel">
          <div className="register-heading">
            <h2>Create Account</h2>
            <p>Join the professional racing network.</p>
          </div>

          <form
            className="register-form"
            onSubmit={(event) => handleRegisterSubmit(event, role)}
          >
            <label className="register-field">
              <span>Username</span>
              <div className="register-input-wrap">
                <span className="material-symbols-outlined">person</span>
                <input
                  type="text"
                  placeholder="horseowner123"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  minLength={3}
                  autoComplete="username"
                  required
                />
              </div>
            </label>

            <label className="register-field">
              <span>Email Address</span>
              <div className="register-input-wrap">
                <span className="material-symbols-outlined">mail</span>
                <input
                  type="email"
                  placeholder="john@stables.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="register-field">
              <span>Primary Role</span>
              <div className="register-input-wrap">
                <span className="material-symbols-outlined">badge</span>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  required
                >
                  <option value="SPECTATOR">Spectator</option>
                  <option value="HORSE_OWNER">Horse Owner</option>
                </select>
                <span className="material-symbols-outlined register-chevron">
                  expand_more
                </span>
              </div>
            </label>

            <label className="register-field">
              <span>Password</span>
              <div className="register-input-wrap">
                <span className="material-symbols-outlined">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="........"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="register-icon-button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>

            <button className="register-submit" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="register-footer">
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                navigate("/login");
              }}
            >
              Already have an account? <strong>Login</strong>
            </a>
            <div className="register-security">
              <span className="material-symbols-outlined">security</span>
              <span>Email Verification Active</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;
