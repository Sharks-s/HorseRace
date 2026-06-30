import React, { useState, useEffect } from 'react';
import { adminResultApi } from '../../../api/adminResultApi';

const AdminResultPage = () => {
  const [pendingRaces, setPendingRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedRaceId, setExpandedRaceId] = useState(null);
  const [confirmRaceId, setConfirmRaceId] = useState(null);

  const loadPendingRaces = async () => {
    setLoading(true);
    try {
      const res = await adminResultApi.getPendingRaces();
      setPendingRaces(res?.data || []);
    } catch (err) {
      setError('Failed to load pending race results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingRaces();
  }, []);

  const handlePublish = async (raceId) => {
    setPublishing(raceId);
    setError(null);
    try {
      await adminResultApi.publishResult(raceId);
      setSuccess('Race result published successfully!');
      setTimeout(() => setSuccess(null), 4000);
      setConfirmRaceId(null);
      await loadPendingRaces();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to publish result.');
    } finally {
      setPublishing(null);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex selection:bg-secondary selection:text-on-secondary">
      <main className="flex-1 bg-surface-container-lowest min-h-screen pb-xl">
        {/* Header */}
        <header className="px-xl py-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest sticky top-0 z-40">
          <div className="flex items-center gap-sm text-on-surface-variant">
            <span className="font-label-md text-label-md hover:text-secondary cursor-pointer transition-colors">Admin</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-label-md text-label-md text-on-surface">Official Results</span>
          </div>
        </header>

        <div className="px-xl pt-xl max-w-container-max mx-auto">
          {/* Page Header */}
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight mb-md text-3xl">Official Results</h2>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
            <div className="bg-white border border-outline-variant/30 rounded-xl p-lg shadow-ambient-lvl1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[64px]">pending_actions</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Pending</span>
              <span className="font-display-lg text-display-lg text-on-surface font-bold text-3xl">{pendingRaces.length}</span>
            </div>
            <div className="bg-white border border-outline-variant/30 rounded-xl p-lg shadow-ambient-lvl1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[64px]">task_alt</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Action Required</span>
              <span className="font-display-lg text-display-lg text-on-surface font-bold text-3xl text-[#d97706]">
                {pendingRaces.length > 0 ? '!' : '✓'}
              </span>
            </div>
            <div className="bg-white border border-outline-variant/30 rounded-xl p-lg shadow-ambient-lvl1 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[64px]">fact_check</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">BR-05 Status</span>
              <span className="font-label-md text-on-surface font-semibold">Referee must submit report before publication.</span>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-lg p-md bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
          )}
          {success && (
            <div className="mb-lg p-md bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>
          )}

          {/* Pending Results List */}
          <section>
            <h3 className="font-headline-sm text-on-surface mb-md text-lg font-bold uppercase tracking-wide">
              Pending Approval ({pendingRaces.length})
            </h3>

            {loading && (
              <div className="text-center py-xl text-on-surface-variant">Loading pending race results...</div>
            )}

            {!loading && pendingRaces.length === 0 && (
              <div className="bg-white border border-outline-variant/30 rounded-xl p-xl text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] block mb-md text-green-500">check_circle</span>
                <p className="font-headline-sm">No pending results. All race results have been published.</p>
              </div>
            )}

            <div className="flex flex-col gap-lg">
              {pendingRaces.map(race => (
                <div key={race.id} className="bg-white border border-outline-variant/30 rounded-xl shadow-ambient-lvl1 flex flex-col overflow-hidden relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f59e0b]"></div>

                  {/* Card Header */}
                  <div className="p-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                    <div className="pl-sm">
                      <div className="flex items-center gap-sm mb-xs">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#fffbeb] text-[#d97706] border border-[#fcd34d]">PENDING APPROVAL</span>
                        <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {formatDate(race.startTime)}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface text-lg">{race.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Status: <span className="font-semibold text-[#d97706]">{race.status}</span>
                        {race.refereeName && ` • Referee: ${race.refereeName}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-sm w-full md:w-auto mt-4 md:mt-0">
                      <button
                        onClick={() => setExpandedRaceId(expandedRaceId === race.id ? null : race.id)}
                        className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-primary text-primary font-label-md uppercase tracking-wider hover:bg-surface-container transition-colors"
                      >
                        {expandedRaceId === race.id ? 'Hide Details' : 'View Report'}
                      </button>
                      <button
                        onClick={() => setConfirmRaceId(race.id)}
                        disabled={publishing === race.id}
                        className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-[#006a61] text-white font-label-md uppercase tracking-wider hover:bg-[#005049] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <span className="material-symbols-outlined text-[18px]">publish</span>
                        {publishing === race.id ? 'Publishing...' : 'Publish Official'}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Publish Warning */}
                  {confirmRaceId === race.id && (
                    <div className="bg-[#eff4ff] border-y border-outline-variant/30 p-md flex items-start gap-md">
                      <span className="material-symbols-outlined text-red-600 text-[24px] mt-0.5">warning</span>
                      <div className="flex-1">
                        <h4 className="font-label-md text-label-md font-bold text-on-surface uppercase mb-1">Confirm Publish</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-3">
                          Publishing these results will make them official and visible to all users. This action cannot be undone.
                        </p>
                        <div className="flex gap-sm">
                          <button
                            onClick={() => handlePublish(race.id)}
                            className="px-3 py-1.5 rounded bg-red-600 text-white font-label-md uppercase hover:bg-red-700 transition-colors"
                          >
                            Confirm & Publish
                          </button>
                          <button
                            onClick={() => setConfirmRaceId(null)}
                            className="px-3 py-1.5 rounded border border-outline-variant text-on-surface-variant font-label-md uppercase hover:bg-surface transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminResultPage;
