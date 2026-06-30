import React, { useState, useEffect, useCallback } from 'react';
import { publicResultApi } from '../../../api/publicResultApi';

const AUTO_REFRESH_INTERVAL = 10000; // 10 seconds

const LiveResultPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [races, setRaces] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [raceResults, setRaceResults] = useState([]);
  const [standings, setStandings] = useState([]);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_INTERVAL / 1000);
  const [loading, setLoading] = useState(false);
  const [raceError, setRaceError] = useState(null);

  // Load tournaments
  useEffect(() => {
    const load = async () => {
      try {
        const res = await publicResultApi.getTournaments();
        const data = res?.data || [];
        setTournaments(data);
        if (data.length > 0) setSelectedTournamentId(data[0].id);
      } catch {
        // ignore – show empty state
      }
    };
    load();
  }, []);

  // When tournament changes, load races
  useEffect(() => {
    if (!selectedTournamentId) return;
    const load = async () => {
      try {
        const res = await publicResultApi.getRacesByTournament(selectedTournamentId);
        const data = (res?.data || []).filter(r => r.status === 'OFFICIAL');
        setRaces(data);
        if (data.length > 0) setSelectedRaceId(data[0].id);
        else setSelectedRaceId('');
      } catch {
        setRaces([]);
      }
    };
    load();
  }, [selectedTournamentId]);

  const fetchData = useCallback(async () => {
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
      }
    } finally {
      setLoading(false);
      setCountdown(AUTO_REFRESH_INTERVAL / 1000);
    }
  }, [selectedTournamentId, selectedRaceId]);

  // Auto refresh
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Countdown timer display
  useEffect(() => {
    const tick = setInterval(() => setCountdown(prev => (prev > 0 ? prev - 1 : AUTO_REFRESH_INTERVAL / 1000)), 1000);
    return () => clearInterval(tick);
  }, []);

  const rankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);
  const selectedRace = races.find(r => r.id === selectedRaceId);

  return (
    <div className="bg-[#0C1A2A] text-white font-body-md min-h-screen flex flex-col antialiased">
      <main className="flex-grow w-full max-w-container-max mx-auto px-md md:px-xl py-lg space-y-xl mt-6">
        {/* Hero Banner */}
        <section className="bg-[#0F172A] border border-outline-variant rounded-xl p-lg md:p-xl shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#009488] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="flex flex-col gap-sm z-10">
            <div className="flex items-center gap-sm">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
              <h1 className="text-red-600 uppercase tracking-wider font-bold text-xl">LIVE RESULTS</h1>
            </div>
            <p className="font-label-md text-label-md text-[#c5c7c8] uppercase flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Auto-refreshing in {countdown}s...
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-md z-10 w-full md:w-auto">
            <div className="flex flex-col gap-1 w-full sm:w-48">
              <label className="font-label-md text-[#c5c7c8]">Tournament</label>
              <select
                value={selectedTournamentId}
                onChange={e => setSelectedTournamentId(e.target.value)}
                className="bg-[#131b2e] border border-outline-variant text-white rounded-lg px-md py-sm focus:border-primary outline-none appearance-none"
              >
                {tournaments.length === 0 && <option>No tournaments</option>}
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-48">
              <label className="font-label-md text-[#c5c7c8]">Race (Official Only)</label>
              <select
                value={selectedRaceId}
                onChange={e => setSelectedRaceId(e.target.value)}
                className="bg-[#131b2e] border border-outline-variant text-white rounded-lg px-md py-sm focus:border-primary outline-none appearance-none"
              >
                {races.length === 0 && <option>No official races yet</option>}
                {races.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* Left Column: Race Standings */}
          <div className="lg:col-span-8 flex flex-col gap-md">
            <h2 className="text-[#009488] flex items-center gap-sm text-lg font-bold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
              Race Standings — {selectedRace?.name || 'Select an official race'}
            </h2>

            {raceError && (
              <div className="p-md bg-[#131b2e] border border-yellow-800 rounded-lg text-yellow-300 text-sm">{raceError}</div>
            )}

            {!raceError && raceResults.length === 0 && !loading && (
              <div className="bg-[#131b2e] border border-outline-variant rounded-lg p-xl text-center text-[#c5c7c8]">
                <span className="material-symbols-outlined text-[48px] block mb-2 opacity-30">hourglass_empty</span>
                <p>No official results to display. Please select an official race or wait for results to be published.</p>
              </div>
            )}

            <div className="flex flex-col gap-sm">
              {/* Header Row */}
              {raceResults.length > 0 && (
                <div className="grid grid-cols-12 gap-sm px-md py-xs text-[#c5c7c8] font-label-md uppercase border-b border-outline-variant pb-2">
                  <div className="col-span-1 text-center">Pos</div>
                  <div className="col-span-5">Horse & Jockey</div>
                  <div className="col-span-3 text-right">Time (s)</div>
                  <div className="col-span-2 text-right">Points</div>
                  <div className="col-span-1 text-right">Status</div>
                </div>
              )}

              {raceResults.map((r) => (
                <div key={r.id} className={`bg-[#131b2e] border border-outline-variant rounded-lg p-md grid grid-cols-12 gap-sm items-center hover:bg-[#1a263d] transition-colors ${r.placement === 1 && !r.violation ? 'ring-1 ring-[#FBBF24]/30' : ''}`}>
                  <div className="col-span-1 flex justify-center items-center">
                    {!r.violation && rankMedal(r.placement) ? (
                      <span className="text-2xl">{rankMedal(r.placement)}</span>
                    ) : (
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${r.violation ? 'bg-error/20 text-error' : 'bg-[#3f465c]'}`}>
                        {r.violation ? '—' : r.placement}
                      </span>
                    )}
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className={`font-semibold text-white ${r.violation ? 'line-through opacity-60' : ''}`}>{r.horseName}</span>
                      <span className="font-label-md text-[#c5c7c8]">J: {r.jockeyName}</span>
                    </div>
                  </div>
                  <div className="col-span-3 flex justify-end font-tabular-nums text-white">{r.finishTime}s</div>
                  <div className="col-span-2 flex justify-end font-tabular-nums text-[#009488] font-bold">{r.points?.toFixed(1)}</div>
                  <div className="col-span-1 flex justify-end">
                    {r.violation ? (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-error/10 text-error text-[10px] font-bold uppercase">DQ</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-[#064E3B] text-[#34D399] text-[10px] font-bold uppercase">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Tournament Leaderboard */}
          <div className="lg:col-span-4 flex flex-col gap-md">
            <h2 className="text-white flex items-center gap-sm text-lg font-bold">
              <span className="material-symbols-outlined text-[#FBBF24]" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
              {selectedTournament?.name || 'Tournament'} Standings
            </h2>
            <div className="bg-[#131b2e] border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
              <div className="bg-[#3f465c] px-md py-sm border-b border-outline-variant flex justify-between items-center">
                <span className="font-label-md text-[#c5c7c8] uppercase">Horse</span>
                <span className="font-label-md text-[#c5c7c8] uppercase">Points</span>
              </div>

              {standings.length === 0 ? (
                <div className="p-xl text-center text-[#c5c7c8] opacity-60">
                  <p className="text-sm">No standings yet. Publish official race results first.</p>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-outline-variant">
                  {standings.slice(0, 10).map((s) => (
                    <li key={s.horseId} className="flex items-center justify-between p-md hover:bg-[#1a263d] transition-colors">
                      <div className="flex items-center gap-sm">
                        <span className={`font-tabular-nums font-bold w-5 ${s.rank <= 3 ? 'text-[#FBBF24]' : 'text-[#c5c7c8]'}`}>{s.rank}.</span>
                        <span className="font-tabular-nums text-white">{s.horseName}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-tabular-nums text-[#009488] font-bold">{s.totalPoints?.toFixed(1)} pts</span>
                        <span className="font-label-md text-[#c5c7c8] text-[10px]">Best: {s.bestFinishTime?.toFixed(2)}s</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {standings.length > 0 && (
              <p className="text-[#c5c7c8] text-xs text-center mt-2">
                Tie-breaking: best finish time ascending
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveResultPage;
