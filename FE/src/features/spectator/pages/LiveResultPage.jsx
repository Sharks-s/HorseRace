import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { publicResultApi } from '../../../api/publicResultApi';
import LiveStandings from '../components/LiveStandings';
import Leaderboard from '../components/Leaderboard';
import './LiveResultPage.css';

const AUTO_REFRESH_INTERVAL = 10000;

const LiveResultPage = () => {
  const location = useLocation();
  const [tournaments, setTournaments] = useState([]);
  const [races, setRaces] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState(location.state?.tournamentId || '');
  const [selectedRaceId, setSelectedRaceId] = useState(location.state?.raceId || '');
  const [raceResults, setRaceResults] = useState([]);
  const [standings, setStandings] = useState([]);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_INTERVAL / 1000);
  const [loading, setLoading] = useState(false);
  const [raceError, setRaceError] = useState(null);

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const res = await publicResultApi.getTournaments();
        const data = res?.data || [];
        setTournaments(data);
        setSelectedTournamentId((current) => current || data[0]?.id || '');
      } catch {
        setTournaments([]);
      }
    };

    void loadTournaments();
  }, []);

  useEffect(() => {
    if (!selectedTournamentId) return;

    const loadRaces = async () => {
      try {
        const res = await publicResultApi.getRacesByTournament(selectedTournamentId);
        const officialRaces = (res?.data || []).filter((race) => race.status === 'OFFICIAL');
        setRaces(officialRaces);
        setSelectedRaceId((current) => {
          if (officialRaces.length === 0) return '';
          return officialRaces.some((race) => race.id === current) ? current : officialRaces[0].id;
        });
      } catch {
        setRaces([]);
        setSelectedRaceId('');
      }
    };

    void loadRaces();
  }, [selectedTournamentId]);

  useEffect(() => {
    const loadLiveData = async () => {
      setLoading(true);
      try {
        if (selectedTournamentId) {
          const standingsRes = await publicResultApi.getTournamentStandings(selectedTournamentId);
          setStandings(standingsRes?.data || []);
        }

        if (selectedRaceId) {
          try {
            const resultsRes = await publicResultApi.getOfficialResults(selectedRaceId);
            setRaceResults(resultsRes?.data || []);
            setRaceError(null);
          } catch {
            setRaceResults([]);
            setRaceError('Results for this race are not official yet.');
          }
        } else {
          setRaceResults([]);
        }
      } finally {
        setLoading(false);
        setCountdown(AUTO_REFRESH_INTERVAL / 1000);
      }
    };

    void loadLiveData();
    const interval = setInterval(() => {
      void loadLiveData();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedTournamentId, selectedRaceId]);

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : AUTO_REFRESH_INTERVAL / 1000));
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  const selectedTournament = tournaments.find((tournament) => tournament.id === selectedTournamentId);
  const selectedRace = races.find((race) => race.id === selectedRaceId);
  const topResult = raceResults.find((result) => result.placement === 1 && !result.violation);

  return (
    <div className="live-results-page">
      <main className="live-results-main">
        <section className="live-results-hero">
          <div className="live-results-hero-copy">
            <div className="live-results-live-row">
              <span className="live-results-live-dot"></span>
              <span>Official Results</span>
            </div>
            <h1>Live Race Board</h1>
            <p>
              Track published race results, finish times, points, and tournament standings from one focused board.
            </p>
          </div>

          <div className="live-results-controls">
            <label>
              <span>Tournament</span>
              <select value={selectedTournamentId} onChange={(event) => setSelectedTournamentId(event.target.value)}>
                {tournaments.length === 0 && <option>No tournaments</option>}
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Official Race</span>
              <select value={selectedRaceId} onChange={(event) => setSelectedRaceId(event.target.value)}>
                {races.length === 0 && <option>No official races yet</option>}
                {races.map((race) => (
                  <option key={race.id} value={race.id}>
                    {race.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="live-results-summary">
          <article>
            <span className="material-symbols-outlined">refresh</span>
            <p>Auto refresh</p>
            <strong>{countdown}s</strong>
          </article>
          <article>
            <span className="material-symbols-outlined">flag</span>
            <p>Official races</p>
            <strong>{races.length}</strong>
          </article>
          <article>
            <span className="material-symbols-outlined">emoji_events</span>
            <p>Current leader</p>
            <strong>{topResult?.horseName || '-'}</strong>
          </article>
          <article>
            <span className="material-symbols-outlined">leaderboard</span>
            <p>Tournament</p>
            <strong>{selectedTournament?.name || '-'}</strong>
          </article>
        </section>

        <section className="live-results-grid">
          <div className="live-results-primary-panel">
            <LiveStandings
              race={selectedRace}
              raceResults={raceResults}
              error={raceError}
              loading={loading}
            />
          </div>

          <aside className="live-results-side-panel">
            <Leaderboard
              title={`${selectedTournament?.name || 'Tournament'} Standings`}
              standings={standings}
              limit={10}
              variant="list"
              showTieBreaker={true}
            />
          </aside>
        </section>
      </main>
    </div>
  );
};

export default LiveResultPage;
