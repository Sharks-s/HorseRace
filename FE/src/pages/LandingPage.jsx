import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tournamentApi } from "../api/tournamentApi";
import { publicResultApi } from "../api/publicResultApi";

// Helper: đọc user từ localStorage
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Mapping role → đường dẫn dashboard
const getDashboardPath = (role) => {
  switch (role) {
    case "ADMIN":       return "/admin";
    case "HORSE_OWNER": return "/owner/horses";
    case "JOCKEY":      return "/jockey";
    case "REFEREE":     return "/referee";
    default:            return "/schedule";
  }
};

const HorseRaceApp = () => {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const [standings, setStandings] = useState([]);

  // Sync auth state when localStorage changes (e.g. login from another tab or after navigate back)
  useEffect(() => {
    const syncUser = () => setCurrentUser(getStoredUser());
    window.addEventListener("storage", syncUser);
    // Also re-read on mount (handles same-tab navigate back)
    syncUser();
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/");
  };


  useEffect(() => {
    const fetchUpcomingRaces = async () => {
      try {
        const response = await tournamentApi.getAllTournaments();
        if (response.success && response.data) {
          let allRaces = [];
          for (const tournament of response.data) {
            const racesRes = await tournamentApi.getRacesByTournament(tournament.id);
            if (racesRes.success && racesRes.data) {
              // Add tournament name to race for displaying context
              const mapped = racesRes.data.map(r => ({
                ...r,
                tournamentName: tournament.name
              }));
              allRaces = [...allRaces, ...mapped];
            }
          }
          // Sort by start time ascending
          allRaces.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
          // Filter to show only SCHEDULED or IN_PROGRESS or CLOSED_REGISTRATION
          const upcoming = allRaces.filter(r => r.status === "SCHEDULED" || r.status === "CLOSED_REGISTRATION" || r.status === "IN_PROGRESS");
          setRaces(upcoming);

          // Get standings for the active tournament
          const ongoingTournaments = response.data.filter(t => t.status === "ONGOING");
          const targetTournament = ongoingTournaments.length > 0 ? ongoingTournaments[0] : (response.data.length > 0 ? response.data[0] : null);
          if (targetTournament) {
            try {
                const standingsRes = await publicResultApi.getTournamentStandings(targetTournament.id);
                if (standingsRes && standingsRes.data) {
                    setStandings(standingsRes.data);
                }
            } catch (err) {
                console.error("Failed to load standings", err);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load upcoming races schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchUpcomingRaces();
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <main className="flex-1 w-full flex flex-col">
        {/* Hero Section */}
        <section
          className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center bg-surface-container-high overflow-hidden"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCsvt5ir6Ktfwa1ZYNRaEdBWgtfdzuuXMByE2iBCAVJYhxs2BxmDisHeSBfahXL-73Y35nYNbkdUpESwUDy-2dw6YxHUILPpha5mD_cLPLogzm1XV3-ALrHUWO1B_-FoW8merBjT5MGSf_CrtMRHlnQeZLuvHG-0Jly-k1n4205_K-hZDNoeshMlsxDmEr3bGv2nodjvFd4dlEf5JIhUHxyBvDe9EYaPYJLw5Lsu0YdVVhq3k-1yl9TsuVsY7f0Y2L8gahfKC65pw')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent"></div>
          <div className="relative z-10 w-full max-w-[1440px] px-8 lg:px-12 flex flex-col justify-center h-full">
            <div className="max-w-2xl">
              <h2 className="font-display-lg text-[56px] lg:text-[72px] text-on-primary mb-6 drop-shadow-md leading-tight">
                Experience the Thrill
              </h2>
              <p className="font-body-lg text-body-lg text-primary-fixed mb-10 max-w-lg drop-shadow">
                Join the premier platform for tournament organizers, stable
                owners, and high-volume bettors.
              </p>

              {/* 5. Thêm chuyển tuyến vào nút Join Now (Thường dẫn đến trang Đăng ký) */}
              <button
                onClick={() => navigate("/register")}
                className="bg-secondary-container text-on-secondary-container font-label-bold text-[16px] px-8 py-4 rounded-lg shadow-xl hover:-translate-y-[2px] transition-transform flex items-center gap-2 w-fit"
              >
                Join Now
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="w-full max-w-[1440px] mx-auto px-8 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Upcoming Races */}
          <section className="lg:col-span-2 w-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline-lg text-headline-lg text-primary">
                Live & Upcoming Races Schedule
              </h3>
              <button className="font-label-bold text-label-bold text-secondary flex items-center hover:underline">
                View All Schedule{" "}
                <span className="material-symbols-outlined text-[16px] ml-1">
                  chevron_right
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {loading ? (
                <div className="text-center py-8 text-on-surface-variant font-medium">Loading schedule...</div>
              ) : races.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant font-medium">No upcoming races found.</div>
              ) : (
                races.map(race => (
                  <article key={race.id} className="bg-surface-container-lowest shadow-[0px_4px_16px_rgba(0,0,0,0.04)] border border-outline-variant rounded-xl p-6 relative overflow-hidden transition-transform hover:-translate-y-[2px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-inverse-primary"></div>
                    <div className="flex-1 ml-2">
                      <div className="flex items-center gap-4 mb-2">
                        <span className={`rounded-full px-3 py-1 font-label-sm text-label-sm flex items-center gap-1.5 w-fit ${
                          race.status === 'IN_PROGRESS' 
                            ? 'bg-error-container text-on-error-container' 
                            : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {race.status === 'IN_PROGRESS' ? 'play_arrow' : 'schedule'}
                          </span>{" "}
                          {race.status}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          ID: #{race.id.slice(0, 8)}
                        </span>
                      </div>
                      <h4 className="font-headline-md text-[28px] text-on-surface mb-1">
                        {race.name}
                      </h4>
                      <p className="font-body-md text-on-surface-variant">
                        {race.tournamentName} (Factor: {race.distanceFactor})
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                        Race Date
                      </p>
                      <p className="font-body-lg text-body-lg text-on-surface font-semibold mb-3">
                        {new Date(race.startTime).toLocaleString("vi-VN")}
                      </p>
                      <button 
                        onClick={() => {
                          if (race.status === 'IN_PROGRESS' || race.status === 'OFFICIAL') {
                            navigate('/live');
                          } else {
                            navigate('/schedule');
                          }
                        }}
                        className="bg-surface-container-high text-on-surface font-label-bold px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors w-full sm:w-auto"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Right Column: Leaderboard */}
          <aside className="lg:col-span-1 w-full">
            <h3 className="font-headline-lg text-headline-lg text-primary mb-8">
              Top Performers
            </h3>
            <div className="bg-surface-container-lowest shadow-[0px_8px_24px_rgba(0,0,0,0.06)] border border-outline-variant rounded-2xl overflow-hidden flex flex-col h-fit">
              <div className="bg-primary text-on-primary p-4 flex items-center justify-between">
                <h4 className="font-label-bold text-[16px]">
                  Jockey / Horse Leaderboard
                </h4>
                <span className="material-symbols-outlined">leaderboard</span>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-variant">
                    <th className="font-label-sm text-label-sm py-3 px-4 w-12 text-center text-on-surface-variant">
                      Rnk
                    </th>
                    <th className="font-label-sm text-label-sm py-3 px-4 text-on-surface-variant">
                      Jockey / Horse
                    </th>
                    <th className="font-label-sm text-label-sm py-3 px-4 text-right text-on-surface-variant">
                      Win %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {standings.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-8 px-4 text-center text-on-surface-variant">
                        No standings available.
                      </td>
                    </tr>
                  ) : (
                    standings.slice(0, 5).map((s, idx) => (
                      <tr key={s.horseId} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-4 text-center">
                          {idx === 0 ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-label-bold text-label-bold">
                              1
                            </span>
                          ) : (
                            <span className="font-label-bold text-[16px] text-on-surface-variant">
                              {idx + 1}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-body-lg text-body-lg text-on-surface font-medium leading-tight">
                            {s.horseName}
                          </p>
                          <p className="font-body-md text-on-surface-variant mt-1">
                            {s.totalPoints} pts
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right font-body-lg text-body-lg text-primary font-bold">
                          {s.bestFinishTime ? s.bestFinishTime.toFixed(2) + 's' : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="p-4 border-t border-surface-variant bg-surface-container-lowest">
                <button className="w-full py-2 text-primary font-label-bold hover:bg-surface-container-low rounded-lg transition-colors">
                  View Full Leaderboard
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HorseRaceApp;
