import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { api } from "../../api/axios";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "dashboard" },
    { path: "/admin/users", label: "Users", icon: "group" },
    { path: "/admin/horses", label: "Horse Review", icon: "fact_check" },
    { path: "/admin/tournaments", label: "Tournaments", icon: "emoji_events" },
    { path: "/admin/results", label: "Results", icon: "leaderboard" },
  ];

  return (
    <div className="bg-background text-on-background font-sans h-screen overflow-hidden flex antialiased">
      {/* 1. Left Sidebar Navigation (Desktop) */}
      <aside className="w-[280px] bg-surface-container-lowest border-r border-outline-variant hidden md:flex flex-col flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant justify-between">
          <h1
            className="text-[28px] font-bold tracking-tighter text-secondary cursor-pointer"
            style={{ fontFamily: "'Oswald', sans-serif" }}
            onClick={() => navigate("/")}
          >
            HorseRace
          </h1>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-semibold"
                    : "text-on-surface hover:bg-surface-container"
                }`
              }
            >
              <span className="material-symbols-outlined text-[24px]">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-error hover:bg-red-50 rounded-xl px-4 py-3 transition-colors font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-[24px]">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-[260px] bg-surface-container-lowest z-40 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant">
          <h1
            className="text-[24px] font-bold tracking-tighter text-secondary cursor-pointer"
            style={{ fontFamily: "'Oswald', sans-serif" }}
            onClick={() => {
              navigate("/");
              setIsMobileMenuOpen(false);
            }}
          >
            HorseRace
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="material-symbols-outlined p-1 rounded-full hover:bg-surface-container"
          >
            close
          </button>
        </div>
        <nav className="flex-1 py-4 px-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-semibold"
                    : "text-on-surface hover:bg-surface-container"
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-error hover:bg-red-50 rounded-xl px-4 py-3 transition-colors font-semibold text-sm"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TopAppBar */}
        <header className="bg-surface border-b border-outline-variant flex justify-between md:justify-end items-center w-full px-6 h-16 z-10 sticky top-0 flex-shrink-0">
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menu"
              className="material-symbols-outlined text-primary cursor-pointer hover:bg-surface-container-high transition-colors p-2 rounded-full"
            >
              menu
            </button>
            <h1
              className="text-2xl font-bold tracking-tighter text-secondary"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Admin Portal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-on-surface-variant">Role: {user?.role}</p>
              <p className="text-sm font-semibold text-on-surface">
                {user?.username || user?.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
              <img
                alt="User profile avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKgpp6xEBxdA5z9XY0dUuekf1yES-zI8bF0itNruirPuxLJ5SfuEaVi1gY3xEUGmCE-ellGvPR2bZYB-GKawiOW9ABxX7qHotVGDgcQrZdEpo2Hzq6e4KzGzKjq5731h3AQfWmt9hMDw4kgWZDzcTC5lRsWTKKCIFcto_N9plll9I1reUVT8wnsVr2SODJyQPaPrOJYKD30cS8UFPqRgMuyTh6irvykShZ79bP6Ys8EWEq4G7qM0OQtan-TYYbNX92jT-ane-pvg"
              />
            </div>
          </div>
        </header>

        {/* Child Router Outlet */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
