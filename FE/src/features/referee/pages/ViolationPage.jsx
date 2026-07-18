import { useCallback, useEffect, useState } from 'react';
import { refereeApi } from '../../../api/refereeApi';
import './ViolationPage.css';

const violationTypes = [
  { value: 'FALSE_START', label: 'False Start' },
  { value: 'LANE_VIOLATION', label: 'Lane Violation' },
  { value: 'OBSTRUCTION', label: 'Obstruction' },
  { value: 'EQUIPMENT_FAULT', label: 'Equipment Fault' },
];

const ViolationPage = () => {
  const [raceId, setRaceId] = useState(null);
  const [availableRaces, setAvailableRaces] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [selectedHorseRegId, setSelectedHorseRegId] = useState('');
  const [violationType, setViolationType] = useState('');
  const [occurrenceMinute, setOccurrenceMinute] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadRaces = async () => {
      try {
        const res = await refereeApi.getAssignedInspections();
        const data = res?.data || [];
        const raceMap = new Map();

        data.forEach((entry) => {
          if (entry.raceId && !raceMap.has(entry.raceId)) {
            raceMap.set(entry.raceId, entry.raceName || entry.raceId);
          }
        });

        const racesArr = [...raceMap.entries()].map(([id, name]) => ({ id, name }));
        setAvailableRaces(racesArr);
        if (racesArr.length > 0) {
          setRaceId((currentRaceId) => currentRaceId || racesArr[0].id);
        }
        setRegistrations(data);
      } catch {
        setError('Could not load assigned races.');
      }
    };

    void loadRaces();
  }, []);

  const loadViolations = useCallback(async () => {
    if (!raceId) return;

    try {
      const res = await refereeApi.getViolations(raceId);
      setViolations(res?.data || []);
    } catch {
      setViolations([]);
    }
  }, [raceId]);

  useEffect(() => {
    if (!raceId) return;

    const loadRaceViolations = async () => {
      try {
        const res = await refereeApi.getViolations(raceId);
        setViolations(res?.data || []);
      } catch {
        setViolations([]);
      }
    };

    void loadRaceViolations();
  }, [raceId]);

  const handleRaceChange = (newRaceId) => {
    setRaceId(newRaceId);
    setViolations([]);
    setSelectedHorseRegId('');
  };

  const handleRecordViolation = async () => {
    if (!selectedHorseRegId || !violationType || !raceId) return;

    const registration = registrations.find((entry) => entry.registrationId === selectedHorseRegId);
    if (!registration) return;

    setLoading(true);
    setError(null);

    try {
      await refereeApi.recordViolation(raceId, {
        horseId: registration.horseId,
        jockeyId: registration.jockeyId,
        type: violationType,
        notes,
        occurrenceMinute: parseInt(occurrenceMinute, 10) || 0,
      });

      setSubmitSuccess('Violation recorded successfully.');
      setTimeout(() => setSubmitSuccess(null), 3000);
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
    } catch {
      setError('Failed to delete violation.');
    }
  };

  const violationTypeLabel = (type) => {
    return violationTypes.find((item) => item.value === type)?.label || type;
  };

  const violationTypeClass = (type) => {
    switch (type) {
      case 'FALSE_START':
        return 'violation-page-type-false-start';
      case 'LANE_VIOLATION':
        return 'violation-page-type-lane';
      case 'OBSTRUCTION':
        return 'violation-page-type-obstruction';
      default:
        return 'violation-page-type-default';
    }
  };

  const raceRegistrations = registrations.filter((entry) => entry.raceId === raceId);

  return (
    <div className="violation-page">
      <main className="violation-page-main">
        <div className="violation-page-container">
          <section className="violation-page-hero">
            <nav aria-label="Breadcrumb" className="violation-page-breadcrumb">
              <ol>
                <li>
                  <a href="/referee">Referee</a>
                </li>
                <li>
                  <span className="material-symbols-outlined">chevron_right</span>
                  <span aria-current="page">Record Violations</span>
                </li>
              </ol>
            </nav>

            <div className="violation-page-header">
              <div>
                <p>Race Referee</p>
                <h2>Record Violations</h2>
              </div>

              {availableRaces.length > 0 && (
                <label className="violation-page-race-select">
                  <span>Select Race</span>
                  <select value={raceId || ''} onChange={(event) => handleRaceChange(event.target.value)}>
                    {availableRaces.map((race) => (
                      <option key={race.id} value={race.id}>
                        {race.name || race.id}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          </section>

          {error && <div className="violation-page-alert violation-page-alert-error">{error}</div>}
          {submitSuccess && <div className="violation-page-alert violation-page-alert-success">{submitSuccess}</div>}

          <section className="violation-page-layout">
            <div className="violation-page-card violation-page-form-card">
              <div className="violation-page-card-accent"></div>
              <div className="violation-page-form-inner">
                <div className="violation-page-card-head">
                  <div>
                    <p>New entry</p>
                    <h3>
                      <span className="material-symbols-outlined">add_alert</span>
                      New Violation
                    </h3>
                  </div>
                </div>

                <form className="violation-page-form" onSubmit={(event) => event.preventDefault()}>
                  <label>
                    <span>Select Participant</span>
                    <select value={selectedHorseRegId} onChange={(event) => setSelectedHorseRegId(event.target.value)}>
                      <option value="">Choose a horse/jockey...</option>
                      {raceRegistrations.map((registration) => (
                        <option key={registration.registrationId} value={registration.registrationId}>
                          {registration.horseName} / {registration.jockeyName || 'Unassigned'}
                        </option>
                      ))}
                      {raceRegistrations.length === 0 && <option disabled>No registrations for this race</option>}
                    </select>
                  </label>

                  <label>
                    <span>Violation Type</span>
                    <select value={violationType} onChange={(event) => setViolationType(event.target.value)}>
                      <option value="">Select type...</option>
                      {violationTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Minute of Occurrence</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 2"
                      value={occurrenceMinute}
                      onChange={(event) => setOccurrenceMinute(event.target.value)}
                    />
                  </label>

                  <label>
                    <span>Description / Notes</span>
                    <textarea
                      rows="3"
                      placeholder="Enter details of the infraction..."
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleRecordViolation}
                    disabled={loading || !selectedHorseRegId || !violationType}
                    className="violation-page-submit"
                  >
                    <span className="material-symbols-outlined">gavel</span>
                    {loading ? 'Recording...' : 'Record Violation'}
                  </button>
                </form>
              </div>
            </div>

            <div className="violation-page-card violation-page-log-card">
              <div className="violation-page-log-head">
                <div>
                  <p>Live log</p>
                  <h3>
                    <span className="material-symbols-outlined">history</span>
                    Violations Log ({violations.length})
                  </h3>
                </div>
                <button type="button" onClick={loadViolations} className="violation-page-refresh">
                  <span className="material-symbols-outlined">refresh</span>
                  Refresh
                </button>
              </div>

              <div className="violation-page-table-wrap">
                <table className="violation-page-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Horse</th>
                      <th>Jockey</th>
                      <th>Type</th>
                      <th>Min</th>
                      <th>Notes</th>
                      <th className="violation-page-align-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {violations.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="violation-page-empty">
                          No violations recorded yet.
                        </td>
                      </tr>
                    ) : (
                      violations.map((violation, index) => (
                        <tr key={violation.id}>
                          <td className="violation-page-muted">{index + 1}</td>
                          <td className="violation-page-horse">{violation.horseName}</td>
                          <td>{violation.jockeyName}</td>
                          <td>
                            <span className={`violation-page-type ${violationTypeClass(violation.type)}`}>
                              {violationTypeLabel(violation.type)}
                            </span>
                          </td>
                          <td className="violation-page-number">{violation.occurrenceMinute}'</td>
                          <td className="violation-page-notes" title={violation.notes}>
                            {violation.notes || '-'}
                          </td>
                          <td className="violation-page-align-center">
                            <button
                              type="button"
                              onClick={() => handleDelete(violation.id)}
                              className="violation-page-delete"
                              aria-label="Delete violation"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ViolationPage;
