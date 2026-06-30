import React from 'react';

const Leaderboard = ({ title, standings, limit = 10, variant = 'list', onViewFull, showTieBreaker = false }) => {
  const displayedStandings = standings.slice(0, limit);

  if (variant === 'table') {
    return (
      <div className="bg-surface-container-lowest shadow-[0px_8px_24px_rgba(0,0,0,0.06)] border border-outline-variant rounded-2xl overflow-hidden flex flex-col h-fit">
        <div className="bg-primary text-on-primary p-4 flex items-center justify-between">
          <h4 className="font-label-bold text-[16px]">{title}</h4>
          <span className="material-symbols-outlined">leaderboard</span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-surface-variant">
              <th className="font-label-sm text-label-sm py-3 px-4 w-12 text-center text-on-surface-variant">Rnk</th>
              <th className="font-label-sm text-label-sm py-3 px-4 text-on-surface-variant">Jockey / Horse</th>
              <th className="font-label-sm text-label-sm py-3 px-4 text-right text-on-surface-variant">Win %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant">
            {displayedStandings.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 px-4 text-center text-on-surface-variant">
                  No standings available.
                </td>
              </tr>
            ) : (
              displayedStandings.map((s, idx) => (
                <tr key={s.horseId} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4 text-center">
                    {idx === 0 ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-label-bold text-label-bold">1</span>
                    ) : (
                      <span className="font-label-bold text-[16px] text-on-surface-variant">{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-body-lg text-body-lg text-on-surface font-medium leading-tight">{s.horseName}</p>
                    <p className="font-body-md text-on-surface-variant mt-1">{s.totalPoints} pts</p>
                  </td>
                  <td className="py-4 px-4 text-right font-body-lg text-body-lg text-primary font-bold">
                    {s.bestFinishTime ? s.bestFinishTime.toFixed(2) + 's' : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {onViewFull && (
          <div className="p-4 border-t border-surface-variant bg-surface-container-lowest">
            <button 
              onClick={onViewFull}
              className="w-full py-2 text-primary font-label-bold hover:bg-surface-container-low rounded-lg transition-colors"
            >
              View Full Leaderboard
            </button>
          </div>
        )}
      </div>
    );
  }

  // default: 'list'
  return (
    <div className="flex flex-col gap-md">
      <h2 className="text-white flex items-center gap-sm text-lg font-bold">
        <span className="material-symbols-outlined text-[#FBBF24]" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
        {title}
      </h2>
      <div className="bg-[#131b2e] border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="bg-[#3f465c] px-md py-sm border-b border-outline-variant flex justify-between items-center">
          <span className="font-label-md text-[#c5c7c8] uppercase">Horse</span>
          <span className="font-label-md text-[#c5c7c8] uppercase">Points</span>
        </div>

        {displayedStandings.length === 0 ? (
          <div className="p-xl text-center text-[#c5c7c8] opacity-60">
            <p className="text-sm">No standings yet. Publish official race results first.</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-outline-variant">
            {displayedStandings.map((s) => (
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

      {showTieBreaker && displayedStandings.length > 0 && (
        <p className="text-[#c5c7c8] text-xs text-center mt-2">
          Tie-breaking: best finish time ascending
        </p>
      )}
    </div>
  );
};

export default Leaderboard;
