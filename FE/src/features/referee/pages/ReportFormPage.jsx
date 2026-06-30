import React, { useState, useEffect } from 'react';
import { refereeApi } from '../../../api/refereeApi';
import { useNavigate } from 'react-router-dom';

const ReportFormPage = () => {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [participants, setParticipants] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);

  // Load available races from pre-race inspections
  useEffect(() => {
    const loadRaces = async () => {
      try {
        const res = await refereeApi.getAssignedInspections();
        const data = res?.data || [];
        const raceMap = new Map();
        data.forEach(r => {
          if (r.raceId && !raceMap.has(r.raceId)) {
            raceMap.set(r.raceId, { id: r.raceId, name: r.raceName, distanceFactor: r.distanceFactor });
          }
        });
        const racesArr = [...raceMap.values()];
        setRaces(racesArr);
        if (racesArr.length > 0) {
          setSelectedRaceId(racesArr[0].id);
        }
      } catch (err) {
        setError('Could not load assigned races.');
      }
    };
    loadRaces();
  }, []);

  // When race changes, load participants from registrations
  useEffect(() => {
    if (!selectedRaceId) return;
    const loadParticipants = async () => {
      try {
        const res = await refereeApi.getAssignedInspections();
        const data = res?.data || [];
        const raceRegs = data.filter(r => r.raceId === selectedRaceId && r.jockeyId);
        setParticipants(raceRegs.map(r => ({
          registrationId: r.registrationId,
          horseId: r.horseId,
          horseName: r.horseName,
          jockeyId: r.jockeyId,
          jockeyName: r.jockeyName || 'Unknown',
          finishTime: '',
          violation: false,
        })));
      } catch {
        setParticipants([]);
      }
    };
    loadParticipants();
  }, [selectedRaceId]);

  const updateParticipant = (regId, field, value) => {
    setParticipants(prev =>
      prev.map(p => p.registrationId === regId ? { ...p, [field]: value } : p)
    );
  };

  const handleSubmit = async () => {
    if (!selectedRaceId || participants.length === 0) return;
    const anyMissingTime = participants.some(p => !p.finishTime || isNaN(parseFloat(p.finishTime)));
    if (anyMissingTime) {
      setError('Please enter finish time for all participants.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const reportData = {
        notes,
        participants: participants.map(p => ({
          horseId: p.horseId,
          jockeyId: p.jockeyId,
          finishTime: parseFloat(p.finishTime),
          violation: p.violation,
        })),
      };
      const res = await refereeApi.submitReport(selectedRaceId, reportData);
      setSubmittedReport(res?.data);
      setSuccess('Race report submitted successfully! Race status is now RESULT_SUBMITTED.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRace = races.find(r => r.id === selectedRaceId);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <main className="flex-grow h-screen overflow-y-auto bg-background p-md md:p-xl transition-all">
        <div className="max-w-[1200px] mx-auto">
          {/* Breadcrumb & Header */}
          <div className="mb-lg">
            <nav aria-label="Breadcrumb" className="flex text-on-surface-variant font-label-md text-label-md mb-2">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <a className="hover:text-secondary transition-colors" href="/referee">Referee</a>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                    <span className="text-on-surface font-semibold">Submit Race Report</span>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="font-display-lg text-display-lg text-on-surface font-bold text-3xl">Submit Race Report</h2>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-on-surface-variant">Select Race:</label>
                <select
                  value={selectedRaceId}
                  onChange={e => setSelectedRaceId(e.target.value)}
                  className="border border-outline-variant rounded-md px-md py-sm font-body-md bg-white focus:border-secondary outline-none"
                >
                  {races.map(r => (
                    <option key={r.id} value={r.id}>{r.name || r.id}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-lg p-md bg-red-50 border border-red-200 rounded-lg text-red-700 font-body-md">{error}</div>
          )}
          {success && (
            <div className="mb-lg p-md bg-green-50 border border-green-200 rounded-lg text-green-700 font-body-md">{success}</div>
          )}

          {/* Race Info Card */}
          {selectedRace && (
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-lg mb-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-surface-variant flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{selectedRace.name}</h3>
                    <span className="px-2 py-1 rounded bg-[#ffecd1] text-[#9a5b00] font-label-md text-label-md uppercase tracking-wider">
                      Pending Report
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">Distance factor: {selectedRace.distanceFactor || 1.0}</p>
                </div>
              </div>
            </div>
          )}

          {/* Participants Results Table */}
          {!submittedReport && (
            <div className="bg-white rounded-xl border-t-4 border-t-secondary border-x border-b border-outline-variant shadow-sm overflow-hidden mb-lg">
              <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">Race Participants & Results</h3>
                </div>
                <span className="font-label-md text-on-surface-variant">{participants.length} participants</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F8FA] border-b border-outline-variant">
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase">Horse</th>
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase">Jockey</th>
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase text-right">Finish Time (s)</th>
                      <th className="p-4 font-label-md text-label-md text-on-surface uppercase text-center w-32">Violated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {participants.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-xl text-center text-on-surface-variant">
                          No RACE_READY participants found for this race. Make sure pre-race inspection is done.
                        </td>
                      </tr>
                    ) : participants.map(p => (
                      <tr key={p.registrationId} className={`hover:bg-surface-container-low transition-colors ${p.violation ? 'bg-error/5 opacity-75' : ''}`}>
                        <td className={`p-4 font-body-lg text-body-lg text-on-surface font-semibold ${p.violation ? 'line-through opacity-60' : ''}`}>
                          {p.horseName}
                        </td>
                        <td className="p-4 font-body-md text-body-md text-on-surface-variant">{p.jockeyName}</td>
                        <td className="p-4 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="e.g. 72.5"
                            value={p.finishTime}
                            onChange={e => updateParticipant(p.registrationId, 'finishTime', e.target.value)}
                            className="border border-outline-variant rounded px-2 py-1 text-right font-tabular-nums w-28 focus:border-secondary outline-none"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={p.violation}
                              onChange={e => updateParticipant(p.registrationId, 'violation', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-error"></div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes */}
          {!submittedReport && (
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-lg mb-lg">
              <label className="block font-label-md text-on-surface mb-xs">Referee Notes (optional)</label>
              <textarea
                rows="3"
                placeholder="Add any general race observations or notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full border border-outline-variant rounded-md px-md py-sm font-body-md focus:border-secondary outline-none resize-none"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || participants.length === 0}
                className="mt-lg w-full bg-[#009488] hover:bg-[#007A70] disabled:opacity-50 text-white font-label-md py-sm px-lg rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                {loading ? 'Submitting Report...' : 'Submit Race Report'}
              </button>
            </div>
          )}

          {/* Submitted report results preview */}
          {submittedReport && (
            <div className="bg-white rounded-xl border border-green-200 shadow-sm p-lg mb-lg">
              <h3 className="font-headline-sm text-headline-sm text-green-700 mb-md flex items-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                Report Submitted — Final Rankings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F8FA] border-b border-outline-variant">
                      <th className="p-3 font-label-md text-label-md uppercase text-on-surface">Rank</th>
                      <th className="p-3 font-label-md text-label-md uppercase text-on-surface">Horse</th>
                      <th className="p-3 font-label-md text-label-md uppercase text-on-surface">Jockey</th>
                      <th className="p-3 font-label-md text-label-md uppercase text-on-surface text-right">Finish Time</th>
                      <th className="p-3 font-label-md text-label-md uppercase text-on-surface text-center">Points</th>
                      <th className="p-3 font-label-md text-label-md uppercase text-on-surface text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {(submittedReport.results || []).map((r) => (
                      <tr key={r.id} className={r.violation ? 'bg-error/5 opacity-70' : 'hover:bg-surface-container-low'}>
                        <td className="p-3 text-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto ${r.placement === 1 ? 'bg-[#fef08a] text-[#854d0e]' : r.placement === 2 ? 'bg-[#e5e7eb] text-[#374151]' : r.placement === 3 ? 'bg-[#fed7aa] text-[#9a3412]' : 'bg-surface-variant'} font-bold text-sm`}>
                            {r.violation ? '—' : r.placement}
                          </div>
                        </td>
                        <td className={`p-3 font-semibold ${r.violation ? 'line-through' : ''}`}>{r.horseName}</td>
                        <td className="p-3 text-on-surface-variant">{r.jockeyName}</td>
                        <td className="p-3 text-right font-tabular-nums">{r.finishTime}s</td>
                        <td className="p-3 text-center font-tabular-nums font-bold text-secondary">{r.points?.toFixed(1)}</td>
                        <td className="p-3 text-center">
                          {r.violation ? (
                            <span className="px-2 py-1 rounded bg-error/10 text-error text-xs font-semibold">DQ</span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">Finished</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-md text-center">
                <button onClick={() => navigate('/referee')} className="text-secondary font-label-md hover:underline">
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          )}

          <div className="mt-xl text-center pb-xl">
            <p className="font-label-md text-label-md text-on-surface-variant flex items-center justify-center gap-2 bg-surface-variant/50 py-3 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px]">info</span>
              BR-05: Results can only be published after referee report is submitted and Admin approval.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportFormPage;
