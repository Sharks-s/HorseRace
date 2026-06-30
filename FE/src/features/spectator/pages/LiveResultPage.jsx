import React, { useState } from 'react';

const LiveResultPage = () => {
  const [refreshCountdown, setRefreshCountdown] = useState(10);
  const [tournament, setTournament] = useState('Global Derby 2024');
  const [race, setRace] = useState('Race 4 - 1200m Sprint');

  return (
    <div className="bg-[#0C1A2A] text-white font-body-md min-h-screen flex flex-col antialiased">
      {/* Main Container */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-md md:px-xl py-lg space-y-xl mt-6">
        {/* Hero Banner */}
        <section className="bg-[#0F172A] border border-outline-variant rounded-xl p-lg md:p-xl shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-lg p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#009488] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="flex flex-col gap-sm z-10">
            <div className="flex items-center gap-sm">
              <div className="w-3 h-3 rounded-full bg-red-600 pulse-live"></div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-red-600 uppercase tracking-wider font-bold text-xl">LIVE RESULTS</h1>
            </div>
            <p className="font-label-md text-label-md text-[#c5c7c8] uppercase flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Refreshing in {refreshCountdown}s...
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-md z-10 w-full md:w-auto gap-4">
            <div className="flex flex-col gap-base w-full sm:w-48">
              <label className="font-label-md text-label-md text-[#c5c7c8]">Tournament</label>
              <select
                value={tournament}
                onChange={(e) => setTournament(e.target.value)}
                className="bg-[#131b2e] border-outline-variant text-white rounded-lg px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary w-full appearance-none outline-none"
              >
                <option>Global Derby 2024</option>
                <option>Autumn Sprint Cup</option>
              </select>
            </div>
            <div className="flex flex-col gap-base w-full sm:w-48">
              <label className="font-label-md text-label-md text-[#c5c7c8]">Race</label>
              <select
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className="bg-[#131b2e] border-outline-variant text-white rounded-lg px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary w-full appearance-none outline-none"
              >
                <option>Race 4 - 1200m Sprint</option>
                <option>Race 3 - 1600m Classic</option>
              </select>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mt-6">
          {/* Left Column: Race Standings (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-md">
            <h2 className="font-headline-md text-headline-md text-[#009488] flex items-center gap-sm text-lg font-bold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
              Race Standings
            </h2>
            <div className="flex flex-col gap-sm mt-3">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-sm px-md py-xs text-[#c5c7c8] font-label-md text-label-md uppercase border-b border-outline-variant pb-2">
                <div className="col-span-2 sm:col-span-1 text-center">Pos</div>
                <div className="col-span-6 sm:col-span-5">Horse &amp; Jockey</div>
                <div className="hidden sm:block sm:col-span-2 text-right">Time</div>
                <div className="hidden sm:block sm:col-span-2 text-right">Odds</div>
                <div className="col-span-4 sm:col-span-2 text-right">Status</div>
              </div>

              {/* Rank 1 Card */}
              <div className="bg-[#131b2e] border border-outline-variant rounded-lg p-md grid grid-cols-12 gap-sm items-center hover:bg-[#1a263d] transition-colors gold-glow p-4">
                <div className="col-span-2 sm:col-span-1 flex justify-center items-center">
                  <span className="text-2xl">🥇</span>
                </div>
                <div className="col-span-6 sm:col-span-5 flex items-center gap-md gap-3">
                  <div className="w-8 h-8 rounded bg-[#3f465c] border border-outline-variant flex items-center justify-center font-tabular-nums text-tabular-nums text-white">4</div>
                  <div className="flex flex-col">
                    <span className="font-tabular-nums text-tabular-nums text-white">Thunderstrike</span>
                    <span className="font-label-md text-label-md text-[#c5c7c8]">J: M. Smith</span>
                  </div>
                </div>
                <div className="hidden sm:flex sm:col-span-2 justify-end font-tabular-nums text-tabular-nums text-white">1:09.42</div>
                <div className="hidden sm:flex sm:col-span-2 justify-end font-tabular-nums text-tabular-nums text-[#FBBF24]">2.50</div>
                <div className="col-span-4 sm:col-span-2 flex justify-end">
                  <span className="inline-flex items-center gap-xs px-2 py-1 rounded bg-[#064E3B] text-[#34D399] font-label-md text-[10px] uppercase border border-[#047857]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] inline-block mr-1"></span> Finished
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tournament Leaderboard (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-md">
            <h2 className="font-headline-md text-headline-md text-white flex items-center gap-sm text-lg font-bold">
              <span className="material-symbols-outlined text-[#FBBF24]" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
              Tournament Standings
            </h2>
            <div className="bg-[#131b2e] border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm mt-3">
              <div className="bg-[#3f465c] px-md py-sm border-b border-outline-variant flex justify-between items-center p-3">
                <span className="font-label-md text-label-md text-[#c5c7c8] uppercase">Top 5 Horses</span>
                <span className="font-label-md text-label-md text-[#c5c7c8] uppercase">Points</span>
              </div>
              <ul className="flex flex-col divide-y divide-outline-variant">
                <li className="flex items-center justify-between p-md hover:bg-[#1a263d] transition-colors p-3">
                  <div className="flex items-center gap-sm">
                    <span className="font-tabular-nums text-tabular-nums text-[#FBBF24] font-bold w-4 mr-2">1.</span>
                    <span className="font-tabular-nums text-tabular-nums text-white">Thunderstrike</span>
                  </div>
                  <span className="font-tabular-nums text-tabular-nums text-[#009488] font-bold">145</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveResultPage;
