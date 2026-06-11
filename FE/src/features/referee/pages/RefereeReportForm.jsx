import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../../api/axios";
import { toast } from "../../../shared/components/Toast";
import "./RefereeReportForm.css";

const formatDateTime = (value) => (value ? new Date(value).toLocaleString("vi-VN") : "-");
const numberOrNull = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const RefereeReportForm = () => {
  const [entries, setEntries] = useState([]);
  const [violations, setViolations] = useState([]);
  const [report, setReport] = useState(null);
  const [selectedRaceId, setSelectedRaceId] = useState("");
  const [finishTimes, setFinishTimes] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const raceReadyEntries = useMemo(() => entries.filter((entry) => entry.status === "RACE_READY"), [entries]);

  const races = useMemo(() => {
    const raceMap = new Map();
    raceReadyEntries.forEach((entry) => {
      if (!raceMap.has(entry.raceId)) {
        raceMap.set(entry.raceId, {
          id: entry.raceId,
          name: entry.raceName,
          startTime: entry.raceStartTime,
          tournamentName: entry.tournamentName,
        });
      }
    });
    return Array.from(raceMap.values()).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [raceReadyEntries]);

  const selectedRaceEntries = useMemo(
    () => raceReadyEntries.filter((entry) => entry.raceId === selectedRaceId),
    [raceReadyEntries, selectedRaceId],
  );

  const distanceCoefficient = selectedRaceEntries[0]?.distanceFactor || 1;

  const previewResults = useMemo(() => {
    return selectedRaceEntries
      .map((entry) => {
        const finishTime = numberOrNull(finishTimes[entry.horseId]);
        return {
          ...entry,
          finishTime,
          score: finishTime == null ? null : finishTime * distanceCoefficient,
          violationFlag: violations.some((violation) => violation.horseId === entry.horseId),
        };
      })
      .sort((a, b) => {
        if (a.score == null && b.score == null) return a.horseName.localeCompare(b.horseName);
        if (a.score == null) return 1;
        if (b.score == null) return -1;
        if (a.score !== b.score) return a.score - b.score;
        return a.finishTime - b.finishTime;
      })
      .map((entry, index) => ({ ...entry, previewRank: entry.score == null ? null : index + 1 }));
  }, [finishTimes, selectedRaceEntries, violations]);

  const loadReport = useCallback(async (raceId) => {
    if (!raceId) return;
    try {
      const response = await api.get(`/referee/races/${raceId}/report`);
      const existingReport = response.data.data;
      setReport(existingReport);
      if (existingReport?.results?.length) {
        setFinishTimes(
          existingReport.results.reduce((acc, result) => {
            acc[result.horseId] = String(result.finishTime);
            return acc;
          }, {}),
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load report status.");
    }
  }, []);

  const loadViolations = useCallback(async (raceId) => {
    if (!raceId) return;
    try {
      const response = await api.get("/referee/violations", { params: { raceId } });
      setViolations(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load violations.");
    }
  }, []);

  const loadContext = useCallback(async () => {
    try {
      const response = await api.get("/referee/pre-race/registrations");
      const inspectionEntries = response.data.data || [];
      setEntries(inspectionEntries);
      const firstRaceId = inspectionEntries.find((entry) => entry.status === "RACE_READY")?.raceId || "";
      setSelectedRaceId((current) => current || firstRaceId);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load report form.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContext();
  }, [loadContext]);

  useEffect(() => {
    setReport(null);
    setViolations([]);
    setFinishTimes({});
    if (selectedRaceId) {
      void loadViolations(selectedRaceId);
      void loadReport(selectedRaceId);
    }
  }, [loadReport, loadViolations, selectedRaceId]);

  const selectedRace = races.find((race) => race.id === selectedRaceId);
  const submitted = Boolean(report?.submittedAt);
  const allFinishTimesEntered =
    selectedRaceEntries.length > 0 &&
    selectedRaceEntries.every((entry) => numberOrNull(finishTimes[entry.horseId]) != null);

  const submitReport = async () => {
    if (!allFinishTimesEntered) {
      toast.error("All RACE_READY horses must have finish time.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = selectedRaceEntries.map((entry) => ({
        horseId: entry.horseId,
        finishTime: Number(finishTimes[entry.horseId]),
      }));
      const response = await api.post(`/referee/races/${selectedRaceId}/report`, payload);
      setReport(response.data.data);
      toast.success("Race report submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not submit report.");
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="report-shell">
      <aside className="report-sidebar">
        <div className="report-logo">HorseRace</div>
        <nav>
          <a href="/referee">
            <span className="material-symbols-outlined">fact_check</span>
            Pre-race
          </a>
          <a href="/referee/violations">
            <span className="material-symbols-outlined">flag</span>
            Violations
          </a>
          <a href="/referee/reports" className="report-active">
            <span className="material-symbols-outlined">assignment</span>
            Reports
          </a>
        </nav>
      </aside>

      <main className="report-main">
        <header className="report-header">
          <div>
            <p>Race Referee</p>
            <h1>Submit Race Report</h1>
          </div>
          {submitted && (
            <div className="report-submitted">
              <strong>Submitted</strong>
              <span>{formatDateTime(report.submittedAt)}</span>
            </div>
          )}
        </header>

        <section className="report-layout">
          <div className="report-workspace">
            <div className="report-toolbar">
              <label>
                <span>Race</span>
                <select
                  value={selectedRaceId}
                  onChange={(event) => setSelectedRaceId(event.target.value)}
                  disabled={submitted}
                >
                  {races.map((race) => (
                    <option key={race.id} value={race.id}>
                      {race.name} - {formatDateTime(race.startTime)}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <span>Tournament</span>
                <strong>{selectedRace?.tournamentName || "-"}</strong>
              </div>
            </div>

            <div className="report-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Horse</th>
                    <th>Jockey</th>
                    <th>Finish Time</th>
                    <th>Preview Rank</th>
                    <th>Violation</th>
                  </tr>
                </thead>
                <tbody>
                  {previewResults.map((entry) => (
                    <tr key={entry.registrationId}>
                      <td>
                        <strong>{entry.horseName}</strong>
                        <span>{entry.ownerUsername}</span>
                      </td>
                      <td>{entry.jockeyName || "Unassigned"}</td>
                      <td>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={finishTimes[entry.horseId] || ""}
                          disabled={submitted}
                          onChange={(event) =>
                            setFinishTimes((current) => ({
                              ...current,
                              [entry.horseId]: event.target.value,
                            }))
                          }
                          placeholder="seconds"
                        />
                      </td>
                      <td>
                        <span className="report-rank">{entry.previewRank || "-"}</span>
                      </td>
                      <td>
                        <span className={entry.violationFlag ? "report-flag report-flag-on" : "report-flag"}>
                          {entry.violationFlag ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!loading && previewResults.length === 0 && (
                    <tr>
                      <td colSpan="5" className="report-empty">
                        No RACE_READY horses are available for report submission.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              className="report-submit"
              disabled={submitted || submitting || !allFinishTimesEntered}
              onClick={() => setConfirmOpen(true)}
            >
              <span className="material-symbols-outlined">upload_file</span>
              Submit Report
            </button>
          </div>

          <aside className="report-side">
            <div className="report-side-head">
              <p>Read-only summary</p>
              <h2>Violations</h2>
            </div>
            <div className="report-violation-list">
              {violations.map((violation) => (
                <article key={violation.id}>
                  <span className={`report-severity report-severity-${violation.severity.toLowerCase()}`}>
                    {violation.severity}
                  </span>
                  <h3>{violation.type.replaceAll("_", " ")}</h3>
                  <p>{violation.description}</p>
                  <small>
                    {violation.horseName} / {violation.jockeyName} - {formatDateTime(violation.timestamp)}
                  </small>
                </article>
              ))}
              {violations.length === 0 && <div className="report-empty">No violations recorded.</div>}
            </div>
          </aside>
        </section>
      </main>

      {confirmOpen && (
        <div className="report-modal-backdrop" role="presentation">
          <div className="report-modal" role="dialog" aria-modal="true">
            <h2>Submit final report?</h2>
            <p>Sau khi submit không thể sửa.</p>
            <div>
              <button type="button" onClick={() => setConfirmOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="button" className="report-confirm" onClick={submitReport} disabled={submitting}>
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefereeReportForm;
