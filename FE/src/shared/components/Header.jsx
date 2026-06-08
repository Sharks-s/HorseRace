import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div
          className="header-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          HorseRace
        </div>

        <nav className="header-nav">
          {/* Menu chung cho tất cả mọi người hoặc Khán giả (Spectator) */}
          <NavLink
            to="/tournaments"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Giải đấu & Lịch đua
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Bảng xếp hạng
          </NavLink>

          {/* CHỨC NĂNG PHÂN QUYỀN THEO ĐÚNG SRS */}
          {user && (
            <>
              {/* 1. ADMIN: Quản lý giải, duyệt hồ sơ, phân công */}
              {user.role === "ADMIN" && (
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Quản trị hệ thống
                </NavLink>
              )}

              {/* 2. HORSE OWNER: Quản lý ngựa, thuê Jockey, Đăng ký giải */}
              {user.role === "HORSE_OWNER" && (
                <>
                  <NavLink
                    to="/owner/horses"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Quản lý ngựa
                  </NavLink>
                  <NavLink
                    to="/owner/hire-jockey"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Thuê Jockey
                  </NavLink>
                </>
              )}

              {/* 3. JOCKEY: Nhận lời mời, xem lịch thi đấu */}
              {user.role === "JOCKEY" && (
                <NavLink
                  to="/jockey/schedule"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Lịch trình & Lời mời
                </NavLink>
              )}

              {/* 4. RACE REFEREE: Kiểm tra điều kiện, ghi nhận lỗi, lập biên bản */}
              {user.role === "REFEREE" && (
                <NavLink
                  to="/referee/reports"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Biên bản trọng tài
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <div className="role-indicator">
                <span className="role-label">Hi, </span>
                <span
                  className="role-value"
                  style={{ fontWeight: "bold", marginRight: "8px" }}
                >
                  {user.username || user.fullName || user.email}
                </span>
                <span
                  className="role-value"
                  style={{
                    fontSize: "12px",
                    background:
                      user.role === "ADMIN"
                        ? "#fee2e2"
                        : user.role === "REFEREE"
                          ? "#fef3c7"
                          : "#e2e8f0",
                    color:
                      user.role === "ADMIN"
                        ? "#991b1b"
                        : user.role === "REFEREE"
                          ? "#92400e"
                          : "#334155",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "600",
                  }}
                >
                  {user.role}
                </span>
              </div>
              <button className="icon-btn" aria-label="Notifications">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
              <button
                className="icon-btn"
                aria-label="Logout"
                onClick={handleLogout}
                title="Đăng xuất"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginRight: "16px",
                }}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                style={{
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
