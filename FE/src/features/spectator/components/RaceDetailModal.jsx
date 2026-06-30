import React from 'react';

const RaceDetailModal = ({ isOpen, race, participants, loading, onClose, onViewLive }) => {
  if (!isOpen || !race) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#f8f9ff] border-b border-outline-variant/50 flex justify-between items-center">
          <div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
              race.status === 'IN_PROGRESS' 
                ? 'bg-error/10 text-error' 
                : race.status === 'OFFICIAL' 
                  ? 'bg-secondary/10 text-secondary' 
                  : 'bg-primary-fixed text-on-primary-fixed-variant'
            }`}>
              {race.status}
            </span>
            <h3 className="font-headline-md text-xl font-bold text-on-surface leading-tight">
              {race.name}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Race Quick Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-outline-variant/20">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Start Time</span>
              <strong className="text-sm font-semibold text-on-surface">
                {new Date(race.startTime).toLocaleString("vi-VN")}
              </strong>
            </div>
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Distance Factor</span>
              <strong className="text-sm font-semibold text-on-surface">
                {race.distanceFactor || 1.0}
              </strong>
            </div>
          </div>

          {/* Participant List */}
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface mb-3 uppercase tracking-wide">
              Registered Participants
            </h4>

            {loading ? (
              <div className="text-center py-6 text-on-surface-variant text-sm font-medium">
                Loading race participants...
              </div>
            ) : participants.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 border border-outline-variant/30 rounded-xl text-on-surface-variant text-sm">
                No participants registered for this race yet.
              </div>
            ) : (
              <div className="space-y-3">
                {participants.map((p) => (
                  <div 
                    key={p.registrationId} 
                    className="bg-white border border-outline-variant/30 p-3 rounded-lg flex items-center justify-between shadow-xs hover:border-outline-variant transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <span className="material-symbols-outlined text-[20px]">pets</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-on-surface">{p.horseName}</h5>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[12px]">person</span>
                          Jockey: {p.jockeyName || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'RACE_READY' 
                        ? 'bg-green-100 text-green-700' 
                        : p.status === 'DISQUALIFIED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.status === 'RACE_READY' ? 'Ready' : p.status === 'DISQUALIFIED' ? 'DQ' : p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-outline-variant/50 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-outline-variant text-on-surface-variant font-label-md uppercase tracking-wider rounded-lg hover:bg-surface transition-colors"
          >
            Close
          </button>
          {race.status === 'OFFICIAL' && onViewLive && (
            <button
              type="button"
              onClick={onViewLive}
              className="px-4 py-2 bg-[#006a61] text-white font-label-md uppercase tracking-wider rounded-lg hover:bg-[#005049] transition-colors flex items-center gap-1"
            >
              View Live Leaderboard
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaceDetailModal;
