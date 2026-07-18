import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { refereeApi } from '../../../api/refereeApi';
import './ReportFormPage.css';

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

  useEffect(() => {
    const loadRaces = async () => {
      try {
        const res = await refereeApi.getAssignedInspections();
        const data = res?.data || [];
        const raceMap = new Map();

        data.forEach((entry) => {
          if (entry.raceId && !raceMap.has(entry.raceId)) {
            raceMap.set(entry.raceId, {
              id: entry.raceId,
              name: entry.raceName,
              distanceFactor: entry.distanceFactor,
            });
          }
        });

        const racesArr = [...raceMap.values()];
        setRaces(racesArr);
        if (racesArr.length > 0) {
          setSelectedRaceId(racesArr[0].id);
        }
      } catch {
        setError('Could not load assigned races.');
      }
    };

    void loadRaces();
  }, []);

  useEffect(() => {
    if (!selectedRaceId) return;

    const loadParticipants = async () => {
      try {
        const res = await refereeApi.getAssignedInspections();
        const data = res?.data || [];
        const raceRegs = data.filter((entry) => entry.raceId === selectedRaceId && entry.jockeyId);

        setParticipants(
          raceRegs.map((entry) => ({
            registrationId: entry.registrationId,
            horseId: entry.horseId,
            horseName: entry.horseName,
            jockeyId: entry.jockeyId,
            jockeyName: entry.jockeyName || 'Unknown',
            finishTime: '',
            violation: false,
          })),
        );
      } catch {
        setParticipants([]);
      }
    };

    void loadParticipants();
  }, [selectedRaceId]);

  const updateParticipant = (regId, field, value) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.registrationId === regId ? { ...participant, [field]: value } : participant,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!selectedRaceId || participants.length === 0) return;

    const anyMissingTime = participants.some((participant) => {
      return !participant.finishTime || Number.isNaN(parseFloat(participant.finishTime));
    });

    if (anyMissingTime) {
      setError('Please enter finish time for all participants.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reportData = {
        notes,
        participants: participants.map((participant) => ({
          horseId: participant.horseId,
          jockeyId: participant.jockeyId,
          finishTime: parseFloat(participant.finishTime),
          violation: participant.violation,
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

  const selectedRace = races.find((race) => race.id === selectedRaceId);

  return (
    <div className="race-report-page">
      <main className="race-report-main">
        <div className="race-report-container">
          <section className="race-report-hero">
            <nav aria-label="Breadcrumb" className="race-report-breadcrumb">
              <ol>
                <li>
                  <a href="/referee">Referee</a>
                </li>
                <li>
                  <span className="material-symbols-outlined">chevron_right</span>
                  <span>Submit Race Report</span>
                </li>
              </ol>
            </nav>

            <div className="race-report-header">
              <div>
                <p>Race Referee</p>
                <h2>Submit Race Report</h2>
              </div>

              <label className="race-report-select">
                <span>Select Race</span>
                <select value={selectedRaceId} onChange={(event) => setSelectedRaceId(event.target.value)}>
                  {races.map((race) => (
                    <option key={race.id} value={race.id}>
                      {race.name || race.id}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {error && <div className="race-report-alert race-report-alert-error">{error}</div>}
          {success && <div className="race-report-alert race-report-alert-success">{success}</div>}

          {selectedRace && (
            <section className="race-report-card race-report-race-card">
              <div className="race-report-race-content">
                <div className="race-report-race-icon">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stadium
                  </span>
                </div>
                <div>
                  <div className="race-report-race-title">
                    <h3>{selectedRace.name}</h3>
                    <span className="race-report-status">Pending Report</span>
                  </div>
                  <p>Distance factor: {selectedRace.distanceFactor || 1.0}</p>
                </div>
              </div>
            </section>
          )}

          {!submittedReport && (
            <section className="race-report-card race-report-results-card">
              <div className="race-report-card-head">
                <div>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emoji_events
                  </span>
                  <h3>Race Participants & Results</h3>
                </div>
                <span>{participants.length} participants</span>
              </div>

              <div className="race-report-table-wrap">
                <table className="race-report-table">
                  <thead>
                    <tr>
                      <th>Horse</th>
                      <th>Jockey</th>
                      <th className="race-report-align-right">Finish Time (s)</th>
                      <th className="race-report-align-center">Violated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="race-report-empty">
                          No RACE_READY participants found for this race. Make sure pre-race inspection is done.
                        </td>
                      </tr>
                    ) : (
                      participants.map((participant) => (
                        <tr
                          key={participant.registrationId}
                          className={participant.violation ? 'race-report-row-violated' : ''}
                        >
                          <td className={participant.violation ? 'race-report-horse race-report-struck' : 'race-report-horse'}>
                            {participant.horseName}
                          </td>
                          <td>{participant.jockeyName}</td>
                          <td className="race-report-align-right">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="e.g. 72.5"
                              value={participant.finishTime}
                              onChange={(event) =>
                                updateParticipant(participant.registrationId, 'finishTime', event.target.value)
                              }
                              className="race-report-time-input"
                            />
                          </td>
                          <td className="race-report-align-center">
                            <label className="race-report-switch">
                              <input
                                type="checkbox"
                                checked={participant.violation}
                                onChange={(event) =>
                                  updateParticipant(participant.registrationId, 'violation', event.target.checked)
                                }
                              />
                              <span aria-hidden="true"></span>
                            </label>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {!submittedReport && (
            <section className="race-report-card race-report-notes-card">
              <label htmlFor="race-report-notes">Referee Notes (optional)</label>
              <textarea
                id="race-report-notes"
                rows="3"
                placeholder="Add any general race observations or notes..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || participants.length === 0}
                className="race-report-submit"
              >
                <span className="material-symbols-outlined">task_alt</span>
                {loading ? 'Submitting Report...' : 'Submit Race Report'}
              </button>
            </section>
          )}

          {submittedReport && (
            <section className="race-report-card race-report-submitted-card">
              <h3>
                <span className="material-symbols-outlined">check_circle</span>
                Report Submitted - Final Rankings
              </h3>

              <div className="race-report-table-wrap">
                <table className="race-report-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Horse</th>
                      <th>Jockey</th>
                      <th className="race-report-align-right">Finish Time</th>
                      <th className="race-report-align-center">Points</th>
                      <th className="race-report-align-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(submittedReport.results || []).map((result) => (
                      <tr key={result.id} className={result.violation ? 'race-report-row-violated' : ''}>
                        <td className="race-report-align-center">
                          <div className={`race-report-rank race-report-rank-${result.placement || 'none'}`}>
                            {result.violation ? '-' : result.placement}
                          </div>
                        </td>
                        <td className={result.violation ? 'race-report-horse race-report-struck' : 'race-report-horse'}>
                          {result.horseName}
                        </td>
                        <td>{result.jockeyName}</td>
                        <td className="race-report-align-right race-report-number">{result.finishTime}s</td>
                        <td className="race-report-align-center race-report-points">{result.points?.toFixed(1)}</td>
                        <td className="race-report-align-center">
                          {result.violation ? (
                            <span className="race-report-result-status race-report-result-dq">DQ</span>
                          ) : (
                            <span className="race-report-result-status race-report-result-finished">Finished</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="race-report-back-wrap">
                <button type="button" onClick={() => navigate('/referee')} className="race-report-back">
                  Back to Dashboard
                </button>
              </div>
            </section>
          )}

          <div className="race-report-info">
            <p>
              <span className="material-symbols-outlined">info</span>
              BR-05: Results can only be published after referee report is submitted and Admin approval.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportFormPage;
