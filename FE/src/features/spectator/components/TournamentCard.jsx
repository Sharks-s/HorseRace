import React from 'react';

const TournamentCard = ({ tournament, races, onRaceClick, onViewStandings }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-outline-variant overflow-hidden flex flex-col border-t-4 border-t-secondary relative">
      {/* Banner Info */}
      <div className="p-lg bg-[#f8f9ff] border-b border-outline-variant flex flex-col md:flex-row justify-between md:items-center gap-md p-4">
        <div className="flex items-start gap-md">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined text-2xl">emoji_events</span>
          </div>
          <div className="pl-3">
            <div className="flex items-center gap-xs mb-1">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface text-lg">
                {tournament.name}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ml-2 uppercase ${
                tournament.status === 'ONGOING' ? 'bg-secondary/20 text-secondary' : 'bg-surface-variant text-on-surface-variant'
              }`}>
                {tournament.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-md gap-y-1 text-on-surface-variant font-body-md text-body-md gap-3">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span> 
                {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right mt-2 md:mt-0">
          <div className="font-tabular-nums text-tabular-nums text-on-surface font-semibold">{races.length} Race(s)</div>
          {onViewStandings && (
            <button 
              onClick={onViewStandings}
              className="mt-2 text-secondary font-label-md text-label-md hover:underline flex items-center gap-1 md:justify-end w-full group"
            >
              View Standings <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
      {/* Expanded Race List */}
      <div className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8f9ff] border-b border-outline-variant font-label-md text-label-md text-on-surface-variant">
              <th className="py-sm px-lg font-semibold p-3">Race Name</th>
              <th className="py-sm px-lg font-semibold p-3">Time</th>
              <th className="py-sm px-lg font-semibold p-3">Factor</th>
              <th className="py-sm px-lg text-right p-3">Status</th>
            </tr>
          </thead>
          <tbody className="font-tabular-nums text-tabular-nums text-on-surface divide-y divide-outline-variant">
            {races.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-on-surface-variant text-sm">
                  No races scheduled in this tournament yet.
                </td>
              </tr>
            ) : (
              races.map((r) => (
                <tr 
                  key={r.id} 
                  className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                  onClick={() => onRaceClick(r)}
                >
                  <td className="py-sm px-lg p-3">
                    <div className="font-medium text-secondary group-hover:underline">{r.name}</div>
                  </td>
                  <td className="py-sm px-lg p-3">
                    {new Date(r.startTime).toLocaleString("vi-VN")}
                  </td>
                  <td className="py-sm px-lg p-3">{r.distanceFactor}</td>
                  <td className="py-sm px-lg text-right p-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase whitespace-nowrap ${
                      r.status === 'IN_PROGRESS' 
                        ? 'bg-error/10 text-error' 
                        : r.status === 'OFFICIAL' 
                          ? 'bg-secondary/10 text-secondary' 
                          : 'bg-primary-fixed text-on-primary-fixed-variant'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentCard;
