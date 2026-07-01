import React from 'react';

const LiveStandings = ({ race, raceResults, error, loading }) => {
  const rankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <div className="flex flex-col gap-md">
      <h2 className="text-[#009488] flex items-center gap-sm text-lg font-bold">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
        Race Standings — {race?.name || 'Select an official race'}
      </h2>

      {error && (
        <div className="p-md bg-[#131b2e] border border-yellow-800 rounded-lg text-yellow-300 text-sm">{error}</div>
      )}

      {!error && raceResults.length === 0 && !loading && (
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
  );
};

export default LiveStandings;
