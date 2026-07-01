import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { publicResultApi } from '../../../api/publicResultApi';
import LiveStandings from '../components/LiveStandings';
import Leaderboard from '../components/Leaderboard';

const AUTO_REFRESH_INTERVAL = 10000; // 10 seconds

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

  // Load tournaments
  useEffect(() => {
    const load = async () => {
      try {
        const res = await publicResultApi.getTournaments();
        const data = res?.data || [];
        setTournaments(data);
        if (data.length > 0 && !selectedTournamentId) {
          setSelectedTournamentId(data[0].id);
        }
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
        
        // If we have a raceId from state and it exists in the fetched list, use it.
        // Otherwise, default to the first one in the list.
        if (data.length > 0) {
          if (!selectedRaceId || !data.some(r => r.id === selectedRaceId)) {
            setSelectedRaceId(data[0].id);
          }
        } else {
          setSelectedRaceId('');
        }
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

  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);
  const selectedRace = races.find(r => r.id === selectedRaceId);

  return (
    <div className="bg-[#0C1A2A] text-white font-body-md min-h-screen flex flex-col antialiased">
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-md md:px-xl py-lg space-y-xl mt-6">
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
          <div className="lg:col-span-8">
            <LiveStandings 
              race={selectedRace} 
              raceResults={raceResults} 
              error={raceError} 
              loading={loading}
            />
          </div>

          {/* Right Column: Tournament Leaderboard */}
          <div className="lg:col-span-4">
            <Leaderboard 
              title={`${selectedTournament?.name || 'Tournament'} Standings`}
              standings={standings}
              limit={10}
              variant="list"
              showTieBreaker={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveResultPage;
