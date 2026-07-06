import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
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

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications/my");
        if (response.data && response.data.success) {
          setNotifications(response.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    void fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
            to="/schedule"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Race Schedule
          </NavLink>
          <NavLink
            to="/live"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Leaderboard
          </NavLink>

          {/* CHỨC NĂNG PHÂN QUYỀN THEO ĐÚNG SRS */}
          {user && (
            <>
              {/* 1. ADMIN: Quản lý giải, duyệt hồ sơ, phân công */}
              {user.role === "ADMIN" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Admin Dashboard
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
                    My Horses
                  </NavLink>
                  <NavLink
                    to="/owner/hiring"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Hire Jockey
                  </NavLink>
                </>
              )}

              {/* 3. JOCKEY: Nhận lời mời, xem lịch thi đấu */}
              {user.role === "JOCKEY" && (
                <>
                  <NavLink
                    to="/jockey/workspace"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Schedule & Profile
                  </NavLink>
                  <NavLink
                    to="/jockey/invitations"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Hiring Invitations
                  </NavLink>
                </>
              )}

              {/* 4. RACE REFEREE: Kiểm tra điều kiện, ghi nhận lỗi, lập biên bản */}
              {user.role === "REFEREE" && (
                <>
                  <NavLink
                    to="/referee/pre-race"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Pre-Race Inspection
                  </NavLink>
                  <NavLink
                    to="/referee/violations"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Record Violations
                  </NavLink>
                  <NavLink
                    to="/referee/report"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Submit Reports
                  </NavLink>
                </>
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
              <div className="notifications-wrapper">
                <button 
                  className="icon-btn" 
                  aria-label="Notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ position: 'relative' }}
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
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <span>Notifications</span>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--color-primary)' }}
                      >
                        Close
                      </button>
                    </div>
                    <div className="notifications-list">
                      {notifications.length === 0 ? (
                        <div className="notifications-empty">No notifications yet</div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            className={`notification-item ${!n.read ? 'unread' : ''}`}
                            onClick={() => {
                              setShowNotifications(false);
                            }}
                          >
                            <div className="notification-title">{n.title}</div>
                            <div className="notification-message">{n.message}</div>
                            <span className="notification-time">
                              {new Date(n.createdAt).toLocaleString("vi-VN")}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                className="icon-btn"
                aria-label="Logout"
                onClick={handleLogout}
                title="Sign Out"
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
                Sign In
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
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
