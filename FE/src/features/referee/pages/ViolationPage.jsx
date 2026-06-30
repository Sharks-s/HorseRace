import React, { useState, useEffect, useCallback } from 'react';
import { refereeApi } from '../../../api/refereeApi';

const ViolationPage = () => {
  // We grab raceId from query params or state; for now default to first race from inspections
  const [raceId, setRaceId] = useState(null);
  const [availableRaces, setAvailableRaces] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Form state
  const [selectedHorseRegId, setSelectedHorseRegId] = useState('');
  const [violationType, setViolationType] = useState('');
  const [occurrenceMinute, setOccurrenceMinute] = useState('');
  const [notes, setNotes] = useState('');

  // Load assigned races from pre-race inspections
  useEffect(() => {
    const loadRaces = async () => {
      try {
        const res = await refereeApi.getAssignedInspections();
        const data = res?.data || [];
        // Extract unique races
        const raceMap = new Map();
        data.forEach(r => {
          if (r.raceId && !raceMap.has(r.raceId)) {
            raceMap.set(r.raceId, r.raceName || r.raceId);
          }
        });
        const racesArr = [...raceMap.entries()].map(([id, name]) => ({ id, name }));
        setAvailableRaces(racesArr);
        if (racesArr.length > 0 && !raceId) {
          setRaceId(racesArr[0].id);
        }
        setRegistrations(data);
      } catch (err) {
        // If API fails use empty state
        setError('Could not load assigned races.');
      }
    };
    loadRaces();
  }, []);

  const loadViolations = useCallback(async () => {
    if (!raceId) return;
    try {
      const res = await refereeApi.getViolations(raceId);
      setViolations(res?.data || []);
    } catch (err) {
      setViolations([]);
    }
  }, [raceId]);

  useEffect(() => {
    loadViolations();
  }, [loadViolations]);

  const handleRaceChange = (newRaceId) => {
    setRaceId(newRaceId);
    setViolations([]);
    setSelectedHorseRegId('');
  };

  const handleRecordViolation = async () => {
    if (!selectedHorseRegId || !violationType || !raceId) return;

    const reg = registrations.find(r => r.registrationId === selectedHorseRegId);
    if (!reg) return;

    setLoading(true);
    setError(null);
    try {
      await refereeApi.recordViolation(raceId, {
        horseId: reg.horseId,
        jockeyId: reg.jockeyId,
        type: violationType,
        notes: notes,
        occurrenceMinute: parseInt(occurrenceMinute) || 0,
      });
      setSubmitSuccess('Violation recorded successfully.');
      setTimeout(() => setSubmitSuccess(null), 3000);
      // Reset form
      setSelectedHorseRegId('');
      setViolationType('');
      setOccurrenceMinute('');
      setNotes('');
      await loadViolations();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to record violation.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (violationId) => {
    try {
      await refereeApi.deleteViolation(violationId);
      await loadViolations();
    } catch (err) {
      setError('Failed to delete violation.');
    }
  };

  const violationTypeLabel = (type) => {
    switch (type) {
      case 'FALSE_START': return 'False Start';
      case 'LANE_VIOLATION': return 'Lane Violation';
      case 'OBSTRUCTION': return 'Obstruction';
      case 'EQUIPMENT_FAULT': return 'Equipment Fault';
      default: return type;
    }
  };

  const violationTypeClass = (type) => {
    switch (type) {
      case 'FALSE_START': return 'bg-red-100 text-red-800 border border-red-200';
      case 'LANE_VIOLATION': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'OBSTRUCTION': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  // registrations for the selected race
  const raceRegistrations = registrations.filter(r => r.raceId === raceId);

  return (
    <div className="bg-[#F7F8FA] text-on-surface flex min-h-screen font-body-md text-body-md overflow-x-hidden">
      <main className="flex-1 min-h-screen">
        <div className="max-w-container-max mx-auto p-xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-lg flex text-on-surface-variant font-label-md text-label-md">
            <ol className="inline-flex items-center space-x-2">
              <li className="inline-flex items-center">
                <a className="hover:text-secondary transition-colors" href="/referee">Referee</a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                  <span aria-current="page" className="text-on-surface font-semibold">Record Violations</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-xl">
            <div className="flex items-start justify-between mb-sm">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary-container mb-1">Record Violations</h2>
                {availableRaces.length > 0 && (
                  <div className="flex items-center gap-md mt-2">
                    <label className="font-body-md text-on-surface-variant">Select Race:</label>
                    <select
                      value={raceId || ''}
                      onChange={(e) => handleRaceChange(e.target.value)}
                      className="bg-white border border-[#E2E8F0] rounded-md px-md py-1 font-body-md focus:border-secondary outline-none"
                    >
                      {availableRaces.map(r => (
                        <option key={r.id} value={r.id}>{r.name || r.id}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-lg p-md bg-red-50 border border-red-200 rounded-lg text-red-700 font-body-md">{error}</div>
          )}
          {submitSuccess && (
            <div className="mb-lg p-md bg-green-50 border border-green-200 rounded-lg text-green-700 font-body-md">{submitSuccess}</div>
          )}

          <div className="grid grid-cols-12 gap-lg">
            {/* Violation Entry Form */}
            <div className="col-span-12 lg:col-span-4 h-fit">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="h-1 bg-secondary w-full text-[#006a61]"></div>
                <div className="p-lg">
                  <h3 className="font-headline-sm text-headline-sm text-primary-container border-b border-outline-variant pb-sm mb-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-secondary">add_alert</span>
                    New Violation
                  </h3>
                  <form className="space-y-md" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs">Select Participant</label>
                      <select
                        value={selectedHorseRegId}
                        onChange={(e) => setSelectedHorseRegId(e.target.value)}
                        className="w-full bg-surface border border-[#E2E8F0] rounded-md px-md py-sm font-body-md focus:border-secondary outline-none"
                      >
                        <option value="">Choose a horse/jockey...</option>
                        {raceRegistrations.map(r => (
                          <option key={r.registrationId} value={r.registrationId}>
                            {r.horseName} / {r.jockeyName || 'Unassigned'}
                          </option>
                        ))}
                        {raceRegistrations.length === 0 && (
                          <option disabled>No registrations for this race</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs">Violation Type</label>
                      <select
                        value={violationType}
                        onChange={(e) => setViolationType(e.target.value)}
                        className="w-full bg-surface border border-[#E2E8F0] rounded-md px-md py-sm font-body-md focus:border-secondary outline-none"
                      >
                        <option value="">Select type...</option>
                        <option value="FALSE_START">False Start</option>
                        <option value="LANE_VIOLATION">Lane Violation</option>
                        <option value="OBSTRUCTION">Obstruction</option>
                        <option value="EQUIPMENT_FAULT">Equipment Fault</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs">Minute of Occurrence</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 2"
                        value={occurrenceMinute}
                        onChange={(e) => setOccurrenceMinute(e.target.value)}
                        className="w-full bg-surface border border-[#E2E8F0] rounded-md px-md py-sm font-tabular-nums focus:border-secondary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-xs">Description / Notes</label>
                      <textarea
                        rows="3"
                        placeholder="Enter details of the infraction..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-surface border border-[#E2E8F0] rounded-md px-md py-sm font-body-md focus:border-secondary outline-none resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="button"
                      onClick={handleRecordViolation}
                      disabled={loading || !selectedHorseRegId || !violationType}
                      className="w-full bg-[#009488] hover:bg-[#007A70] disabled:opacity-50 text-white font-label-md text-label-md py-sm px-lg rounded-md transition-colors flex items-center justify-center gap-xs mt-lg shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">gavel</span>
                      {loading ? 'Recording...' : 'Record Violation'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Violations Log Table */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
                <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
                  <h3 className="font-headline-sm text-headline-sm text-primary-container flex items-center gap-xs">
                    <span className="material-symbols-outlined text-on-surface-variant">history</span>
                    Violations Log ({violations.length})
                  </h3>
                  <button
                    onClick={loadViolations}
                    className="text-secondary font-label-md text-label-md hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    Refresh
                  </button>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F7F8FA] border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant">#</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant">Horse</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant">Jockey</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant">Type</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant">Min</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant max-w-[200px]">Notes</th>
                        <th className="p-md font-label-md text-label-md text-on-surface-variant text-center w-[80px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] font-tabular-nums text-tabular-nums text-on-surface">
                      {violations.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-xl text-center text-on-surface-variant">
                            No violations recorded yet.
                          </td>
                        </tr>
                      ) : violations.map((violation, idx) => (
                        <tr key={violation.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                          <td className="p-md text-on-surface-variant">{idx + 1}</td>
                          <td className="p-md font-semibold">{violation.horseName}</td>
                          <td className="p-md text-on-surface-variant">{violation.jockeyName}</td>
                          <td className="p-md">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${violationTypeClass(violation.type)}`}>
                              {violationTypeLabel(violation.type)}
                            </span>
                          </td>
                          <td className="p-md">{violation.occurrenceMinute}'</td>
                          <td className="p-md text-on-surface-variant truncate max-w-[200px]" title={violation.notes}>
                            {violation.notes || '—'}
                          </td>
                          <td className="p-md text-center">
                            <button
                              onClick={() => handleDelete(violation.id)}
                              className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-md hover:bg-error-container/50"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViolationPage;
