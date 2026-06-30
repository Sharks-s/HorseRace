import React from 'react';

const UpcomingRaceCard = ({ race, onViewDetails }) => {
  return (
    <article className="bg-surface-container-lowest shadow-[0px_4px_16px_rgba(0,0,0,0.04)] border border-outline-variant rounded-xl p-6 relative overflow-hidden transition-transform hover:-translate-y-[2px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
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
          onClick={onViewDetails}
          className="bg-surface-container-high text-on-surface font-label-bold px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors w-full sm:w-auto"
        >
          View Details
        </button>
      </div>
    </article>
  );
};

export default UpcomingRaceCard;
