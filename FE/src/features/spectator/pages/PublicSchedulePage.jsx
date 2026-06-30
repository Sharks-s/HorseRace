import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tournamentApi } from '../../../api/tournamentApi';
import { registrationApi } from '../../../api/registrationApi';
import TournamentCard from '../components/TournamentCard';
import AdBanners from '../components/AdBanners';
import RaceDetailModal from '../components/RaceDetailModal';

const PublicSchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tournaments, setTournaments] = useState([]);
  const [tournamentRaces, setTournamentRaces] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, THIS_WEEK, THIS_MONTH
  const [loading, setLoading] = useState(true);

  // Detail Modal States
  const [selectedRaceForDetail, setSelectedRaceForDetail] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const handleRaceClick = async (race, tournamentId) => {
    setSelectedRaceForDetail({ ...race, tournamentId });
    setLoadingParticipants(true);
    setParticipants([]);
    try {
      const res = await registrationApi.getRaceRegistrations(race.id);
      if (res.success && res.data) {
        setParticipants(res.data);
      }
    } catch (err) {
      console.error("Failed to load race participants", err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  useEffect(() => {
    const fetchTournamentsAndRaces = async () => {
      setLoading(true);
      try {
        const tResponse = await tournamentApi.getAllTournaments();
        if (tResponse.success && tResponse.data) {
          const list = tResponse.data;
          setTournaments(list);

          const racesMap = {};
          await Promise.all(
            list.map(async (t) => {
              try {
                const rResponse = await tournamentApi.getRacesByTournament(t.id);
                if (rResponse.success) {
                  racesMap[t.id] = rResponse.data;
                }
              } catch {
                racesMap[t.id] = [];
              }
            })
          );
          setTournamentRaces(racesMap);
        }
      } catch (error) {
        console.error("Failed to load public schedule data", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchTournamentsAndRaces();
  }, []);

  useEffect(() => {
    if (loading) return;
    const openRaceId = location.state?.openRaceId;
    if (openRaceId) {
      let foundRace = null;
      for (const tId in tournamentRaces) {
        const race = tournamentRaces[tId].find(r => r.id === openRaceId);
        if (race) {
          foundRace = race;
          break;
        }
      }
      if (foundRace) {
        void handleRaceClick(foundRace, tId);
        // Clear location state from history so it doesn't open again on page refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [loading, tournamentRaces, location.state]);

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const tStart = new Date(t.startDate);


    if (filterType === 'THIS_WEEK') {
      const oneWeekLater = new Date(now);
      oneWeekLater.setDate(now.getDate() + 7);
      oneWeekLater.setHours(23, 59, 59, 999);
      return tStart >= now && tStart <= oneWeekLater;
    }

    if (filterType === 'THIS_MONTH') {
      const oneMonthLater = new Date(now);
      oneMonthLater.setMonth(now.getMonth() + 1);
      oneMonthLater.setHours(23, 59, 59, 999);
      return tStart >= now && tStart <= oneMonthLater;
    }

    return true;
  });

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] antialiased min-h-screen flex flex-col font-body-md text-body-md py-6">
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="bg-[#131b2e] text-white py-[60px] px-md md:px-xl relative overflow-hidden rounded-xl mx-4">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% -20%, #009488 0%, transparent 50%)" }}></div>
          <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center text-center space-y-xl">
            <h1 className="font-display-lg text-display-lg md:text-[48px] leading-tight font-bold text-4xl">Race Schedule</h1>
            <p className="font-body-lg text-body-lg text-[#7c839b] max-w-2xl mt-4">Discover upcoming tournaments, track live races, and analyze historical performance data across premier global tracks.</p>
            {/* Search & Filter Bar */}
            <div className="w-full max-w-4xl mt-lg">
              <div className="glass-panel rounded-xl flex flex-col md:flex-row items-center gap-sm bg-white/10 border-white/20 p-2">
                <div className="relative w-full flex-grow">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 transform -translate-y-1/2 text-white/50 pl-2">search</span>
                  <input
                    type="text"
                    placeholder="Search tournaments, tracks, or horses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border-none text-white placeholder:text-white/50 pl-[40px] pr-sm py-sm rounded focus:ring-2 focus:ring-secondary outline-none font-body-md text-body-md"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
                  <button 
                    type="button"
                    onClick={() => setFilterType('ALL')}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${
                      filterType === 'ALL' ? 'bg-[#006a61] text-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    All
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFilterType('THIS_WEEK')}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${
                      filterType === 'THIS_WEEK' ? 'bg-[#006a61] text-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    This Week
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFilterType('THIS_MONTH')}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${
                      filterType === 'THIS_MONTH' ? 'bg-[#006a61] text-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    This Month
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tournament Grid */}
        <section className="py-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full mt-8 mb-12">
          <div className="flex justify-between items-end mb-lg">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface text-2xl">Featured Tournaments</h2>
            <span className="font-label-md text-on-surface-variant">{filteredTournaments.length} tournament(s) found</span>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant font-medium">Loading schedules...</div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center py-12 bg-white border border-outline-variant rounded-xl text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] opacity-40 mb-2">calendar_today</span>
              <p>No tournaments scheduled for the selected criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 w-full">
              {/* Left Column: Tournaments List (takes 8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {filteredTournaments.map((t) => (
                  <TournamentCard 
                    key={t.id} 
                    tournament={t} 
                    races={tournamentRaces[t.id] || []} 
                    onRaceClick={(race) => handleRaceClick(race, t.id)}
                    onViewStandings={() => navigate('/live')}
                  />
                ))}
              </div>

              {/* Right Column: Advertising Banner (takes 4 cols) */}
              <div className="lg:col-span-4 w-full">
                <AdBanners />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Race Detail Modal */}
      <RaceDetailModal 
        isOpen={selectedRaceForDetail !== null}
        race={selectedRaceForDetail}
        participants={participants}
        loading={loadingParticipants}
        onClose={() => setSelectedRaceForDetail(null)}
        onViewLive={() => {
          setSelectedRaceForDetail(null);
          navigate('/live', { 
            state: { 
              tournamentId: selectedRaceForDetail.tournamentId, 
              raceId: selectedRaceForDetail.id 
            } 
          });
        }}
      />
    </div>
  );
};

export default PublicSchedulePage;
