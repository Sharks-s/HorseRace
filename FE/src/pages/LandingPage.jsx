import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tournamentApi } from "../api/tournamentApi";
import { publicResultApi } from "../api/publicResultApi";
import UpcomingRaceCard from "../features/spectator/components/UpcomingRaceCard";
import Leaderboard from "../features/spectator/components/Leaderboard";

// Helper: đọc user từ localStorage
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
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
    syncUser();
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  useEffect(() => {
    const fetchUpcomingRaces = async () => {
      try {
        const response = await tournamentApi.getAllTournaments();
        if (response.success && response.data) {
          let allRaces = [];
          for (const tournament of response.data) {
            const racesRes = await tournamentApi.getRacesByTournament(tournament.id);
            if (racesRes.success && racesRes.data) {
              const mapped = racesRes.data.map(r => ({
                ...r,
                tournamentName: tournament.name
              }));
              allRaces = [...allRaces, ...mapped];
            }
          }
          allRaces.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
          const upcoming = allRaces.filter(r => r.status === "SCHEDULED" || r.status === "CLOSED_REGISTRATION" || r.status === "IN_PROGRESS");
          setRaces(upcoming);

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
              <button 
                onClick={() => navigate("/schedule")}
                className="font-label-bold text-label-bold text-secondary flex items-center hover:underline"
              >
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
                  <UpcomingRaceCard 
                    key={race.id}
                    race={race}
                    onViewDetails={() => navigate('/schedule', { state: { openRaceId: race.id } })}
                  />
                ))
              )}
            </div>
          </section>

          {/* Right Column: Leaderboard */}
          <aside className="lg:col-span-1 w-full">
            <Leaderboard 
              title="Top Performers"
              standings={standings}
              limit={5}
              variant="table"
              onViewFull={() => navigate('/live')}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HorseRaceApp;
