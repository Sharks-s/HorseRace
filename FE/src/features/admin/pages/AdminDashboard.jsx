import { useState, useEffect } from "react";
import { adminUserApi } from "../../../api/adminUserApi";
import { tournamentApi } from "../../../api/tournamentApi";
import { api } from "../../../api/axios";

const AdminDashboard = () => {
  // Trạng thái đóng/mở sidebar trên thiết bị di động
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [referees, setReferees] = useState([]);
  const [races, setRaces] = useState([]);
  const [pendingHorses, setPendingHorses] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [jockeyCount, setJockeyCount] = useState(0);
  const [refereeCount, setRefereeCount] = useState(0);

  useEffect(() => {
    void fetchReferees();
    void fetchRaces();
    void fetchJockeys();
    void fetchPendingHorses();
  }, []);

  const fetchPendingHorses = async () => {
    try {
      const response = await api.get("/admin/horses/pending", { params: { size: 10 } });
      if (response.data && response.data.success) {
        setPendingHorses(response.data.data.content || []);
        setPendingCount(response.data.data.totalElements || 0);
      }
    } catch (error) {
      console.error("Failed to fetch pending horses", error);
    }
  };

  const fetchJockeys = async () => {
    try {
      const response = await adminUserApi.getUsers({ role: 'JOCKEY', size: 1 });
      if (response.success && response.data) {
        setJockeyCount(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error("Failed to fetch jockeys", error);
    }
  };

  const fetchReferees = async () => {
    try {
      const response = await adminUserApi.getUsers({ role: 'REFEREE', size: 100 });
      if (response.success && response.data?.content) {
        setReferees(response.data.content);
        setRefereeCount(response.data.totalElements || response.data.content.length);
      }
    } catch (error) {
      console.error("Failed to fetch referees", error);
    }
  };

  const fetchRaces = async () => {
    try {
      const tResponse = await tournamentApi.getAllTournaments();
      if (tResponse.success) {
        let allRaces = [];
        for (const t of tResponse.data) {
           const rResponse = await tournamentApi.getRacesByTournament(t.id);
           if (rResponse.success) {
               allRaces = [...allRaces, ...rResponse.data];
           }
        }
        setRaces(allRaces);
      }
    } catch (error) {
      console.error("Failed to fetch races", error);
    }
  };

  const handleApproveHorse = async (horseId) => {
    try {
      const response = await api.put(`/admin/horses/${horseId}/approve`);
      if (response.data && response.data.success) {
        alert("Horse profile approved successfully!");
        void fetchPendingHorses();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve horse");
    }
  };

  const handleRejectHorse = async (horseId) => {
    const reason = prompt("Enter the reason for rejection:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }
    try {
      const response = await api.put(`/admin/horses/${horseId}/reject`, { reason: reason.trim() });
      if (response.data && response.data.success) {
        alert("Horse profile rejected successfully!");
        void fetchPendingHorses();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject horse");
    }
  };

  const handleAssignReferee = async (tournamentId, raceId, refereeId) => {
    if (!refereeId) return;
    try {
        const response = await tournamentApi.assignReferee(tournamentId, raceId, refereeId);
        if (response.success) {
            alert("Referee assigned successfully!");
            void fetchRaces(); // Refresh races to show updated assignment
        }
    } catch (error) {
        alert(error.response?.data?.message || "Failed to assign referee");
    }
  };

  const statsData = [
    {
      label: "Total Jockeys",
      value: String(jockeyCount),
      icon: "sports_kabaddi",
      fillClass: "group-hover:text-secondary-fixed",
    },
    {
      label: "Total Referees",
      value: String(refereeCount),
      icon: "group",
      fillClass: "group-hover:text-tertiary-fixed",
    },
    {
      label: "Created Races",
      value: String(races.length),
      icon: "timer",
      fillClass: "group-hover:text-primary-fixed",
    },
    {
      label: "Pending Approvals",
      value: String(pendingCount),
      valueColor: "text-error",
      icon: "fact_check",
      fillClass: "group-hover:text-error-container",
    },
  ];

  return (
    <div className="bg-background text-on-background font-sans h-screen overflow-hidden flex antialiased">
      {/* 1. Left Sidebar Navigation (Desktop) */}
      <aside className="w-[280px] bg-surface-container-lowest border-r border-outline-variant hidden md:flex flex-col flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant">
          <h1
            className="text-[28px] font-bold tracking-tighter text-secondary"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            HorseRace
          </h1>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          <a
            className="flex items-center gap-3 bg-secondary-container text-on-secondary-container rounded-xl px-4 py-3 transition-colors"
            href="#dashboard"
          >
            <span className="material-symbols-outlined text-[24px]">
              dashboard
            </span>
            <span className="font-semibold text-sm">Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 text-on-surface hover:bg-surface-container rounded-xl px-4 py-3 transition-colors"
            href="/admin/users"
          >
            <span className="material-symbols-outlined text-[24px]">group</span>
            <span className="font-semibold text-sm">Users</span>
          </a>
          <a
            className="flex items-center gap-3 text-on-surface hover:bg-surface-container rounded-xl px-4 py-3 transition-colors"
            href="/admin/horses"
          >
            <span className="material-symbols-outlined text-[24px]">fact_check</span>
            <span className="font-semibold text-sm">Horse Review</span>
          </a>
          <a
            className="flex items-center gap-3 text-on-surface hover:bg-surface-container rounded-xl px-4 py-3 transition-colors"
            href="/admin/tournaments"
          >
            <span className="material-symbols-outlined text-[24px]">
              emoji_events
            </span>
            <span className="font-semibold text-sm">Tournaments</span>
          </a>
          <a
            className="flex items-center gap-3 text-on-surface hover:bg-surface-container rounded-xl px-4 py-3 transition-colors"
            href="#results"
          >
            <span className="material-symbols-outlined text-[24px]">
              leaderboard
            </span>
            <span className="font-semibold text-sm">Results</span>
          </a>
        </nav>
      </aside>

      {/* Backdrop cho mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Trượt ra khi nhấn menu) */}
      <aside
        className={`fixed inset-y-0 left-0 w-[260px] bg-surface-container-lowest z-40 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:hidden flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant">
          <h1
            className="text-[24px] font-bold tracking-tighter text-secondary"
            style={{ fontFamily: "'Oswald', sans-serif" }}
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
        <nav className="flex-1 py-4 px-4 flex flex-col gap-2">
          <a
            className="flex items-center gap-3 bg-secondary-container text-on-secondary-container rounded-xl px-4 py-3"
            href="/admin"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-semibold text-sm">Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 text-on-surface hover:bg-surface-container rounded-xl px-4 py-3 transition-colors"
            href="/admin/users"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-semibold text-sm">Users</span>
          </a>
          <a
            className="flex items-center gap-3 text-on-surface hover:bg-surface-container rounded-xl px-4 py-3 transition-colors"
            href="/admin/horses"
          >
            <span className="material-symbols-outlined">fact_check</span>
            <span className="font-semibold text-sm">Horse Review</span>
          </a>
          <a
            className="flex items-center gap-3 text-on-surface hover:bg-surface-container rounded-xl px-4 py-3 transition-colors"
            href="/admin/tournaments"
          >
            <span className="material-symbols-outlined">emoji_events</span>
            <span className="font-semibold text-sm">Tournaments</span>
          </a>
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
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
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              notifications
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
              <img
                alt="User profile avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKgpp6xEBxdA5z9XY0dUuekf1yES-zI8bF0itNruirPuxLJ5SfuEaVi1gY3xEUGmCE-ellGvPR2bZYB-GKawiOW9ABxX7qHotVGDgcQrZdEpo2Hzq6e4KzGzKjq5731h3AQfWmt9hMDw4kgWZDzcTC5lRsWTKKCIFcto_N9plll9I1reUVT8wnsVr2SODJyQPaPrOJYKD30cS8UFPqRgMuyTh6irvykShZ79bP6Ys8EWEq4G7qM0OQtan-TYYbNX92jT-ane-pvg"
              />
            </div>
          </div>
        </header>

        {/* Main Dashboard Workspace */}
        <main className="p-4 md:p-6 w-full flex flex-col gap-12">
          {/* Top Stats Row */}
          <section className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_12px_rgba(15,23,42,0.1)] border border-outline-variant/30 flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-[2px] transition-transform"
                >
                  <div
                    className={`absolute -right-4 -top-4 text-surface-container-highest opacity-50 ${stat.fillClass} transition-colors`}
                  >
                    <span
                      className="material-symbols-outlined text-[80px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {stat.icon}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm text-on-surface-variant mb-1 font-medium">
                      {stat.label}
                    </p>
                    <p
                      className={`text-2xl font-bold tracking-tight ${stat.valueColor || "text-primary"}`}
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dual Pane Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start mb-16 md:mb-0">
            {/* Left Pane: Pending Registrations Data Table */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <h2
                className="text-2xl font-semibold text-on-surface border-b border-outline-variant pb-2"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Pending Horse Registrations
              </h2>
              <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.1)] border border-outline-variant/30 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container text-on-surface-variant font-semibold text-sm border-b border-outline-variant/30">
                    <tr>
                      <th className="py-3 px-4 whitespace-nowrap">
                        Horse Name
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap">Owner</th>
                      <th className="py-3 px-4 whitespace-nowrap">Status</th>
                      <th className="py-3 px-4 whitespace-nowrap text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {pendingHorses.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-4 text-center text-sm text-on-surface-variant font-medium">
                          No pending horse registrations.
                        </td>
                      </tr>
                    ) : (
                      pendingHorses.map((horse) => (
                        <tr
                          key={horse.id}
                          className="hover:bg-surface-container-lowest/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-on-surface whitespace-nowrap text-sm">
                            {horse.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-on-surface-variant whitespace-nowrap">
                            {horse.ownerUsername || horse.ownerEmail || "Unknown"}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className="inline-flex font-medium text-xs px-2 py-1 rounded-full items-center gap-1 bg-error-container text-on-error-container"
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                warning
                              </span>
                              {horse.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleApproveHorse(horse.id)}
                                className="bg-[#004225] text-white font-semibold text-xs px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRejectHorse(horse.id)}
                                className="border border-outline-variant text-on-surface-variant font-semibold text-xs px-3 py-1.5 rounded hover:bg-surface-container transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Pane: Referee Assignment */}
            <div className="lg:col-span-1 flex flex-col gap-3">
              <h2
                className="text-2xl font-semibold text-on-surface border-b border-outline-variant pb-2"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Referee Assignment
              </h2>
              <div className="flex flex-col gap-2">
                {races.map((race) => (
                  <div
                    key={race.id}
                    className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_12px_rgba(15,23,42,0.1)] border border-outline-variant/30 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="bg-tertiary-container text-on-tertiary-container w-10 h-10 rounded-lg flex items-center justify-center font-medium text-[18px]"
                        style={{ fontFamily: "'Oswald', sans-serif" }}
                      >
                        {race.id}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-on-surface leading-tight">
                          {race.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(race.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="w-full">
                      <select 
                        className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        value={race.refereeId || ""}
                        onChange={(e) => handleAssignReferee(race.tournamentId, race.id, e.target.value)}
                      >
                        <option value="">Assign Referee...</option>
                        {referees.map(ref => (
                            <option key={ref.id} value={ref.id}>{ref.fullName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* 3. Mobile Bottom Nav Bar (Chỉ hiển thị trên Mobile) */}
      <nav className="md:hidden bg-[#002a15] shadow-[0_-4px_12px_rgba(0,0,0,0.1)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 rounded-t-xl">
        <a
          className="flex flex-col items-center justify-center bg-secondary text-on-secondary rounded-xl px-3 py-1 scale-95 duration-200"
          href="/admin"
        >
          <span className="material-symbols-outlined text-[24px]">
            dashboard
          </span>
          <span className="text-[10px] mt-0.5 font-medium">Dashboard</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-primary-container px-3 py-1 hover:bg-primary-container/50 transition-all rounded-xl"
          href="/admin/users"
        >
          <span className="material-symbols-outlined text-[24px]">group</span>
          <span className="text-[10px] mt-0.5 font-medium">Users</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-primary-container px-3 py-1 hover:bg-primary-container/50 transition-all rounded-xl"
          href="/admin/horses"
        >
          <span className="material-symbols-outlined text-[24px]">fact_check</span>
          <span className="text-[10px] mt-0.5 font-medium">Review</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-primary-container px-3 py-1 hover:bg-primary-container/50 transition-all rounded-xl"
          href="/admin/tournaments"
        >
          <span className="material-symbols-outlined text-[24px]">
            emoji_events
          </span>
          <span className="text-[10px] mt-0.5 font-medium">Tournaments</span>
        </a>
      </nav>
    </div>
  );
};

export default AdminDashboard;
