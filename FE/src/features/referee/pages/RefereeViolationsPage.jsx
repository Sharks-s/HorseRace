import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../../api/axios";
import { toast } from "../../../shared/components/Toast";
import "./RefereeViolationsPage.css";

const typeOptions = [
  "LANE_VIOLATION",
  "FALSE_START",
  "DANGEROUS_RIDING",
  "OBSTRUCTION",
  "OTHER",
];

const severityOptions = ["WARNING", "DISQUALIFY"];

const emptyForm = {
  raceId: "",
  registrationId: "",
  type: "LANE_VIOLATION",
  severity: "WARNING",
  timestamp: "",
  description: "",
};

const formatDateTime = (value) => (value ? new Date(value).toLocaleString("vi-VN") : "-");
const toDatetimeLocal = (value) => {
  const date = value ? new Date(value) : new Date();
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

const RefereeViolationsPage = () => {
  const [entries, setEntries] = useState([]);
  const [violations, setViolations] = useState([]);
  const [form, setForm] = useState(() => ({ ...emptyForm, timestamp: toDatetimeLocal() }));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const races = useMemo(() => {
    const raceMap = new Map();
    entries.forEach((entry) => {
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
  }, [entries]);

  const selectedRaceEntries = useMemo(
    () => entries.filter((entry) => entry.raceId === form.raceId && entry.jockeyId),
    [entries, form.raceId],
  );

  const selectedEntry = useMemo(
    () => selectedRaceEntries.find((entry) => entry.registrationId === form.registrationId) || null,
    [form.registrationId, selectedRaceEntries],
  );

  const loadContext = useCallback(async () => {
    try {
      const response = await api.get("/referee/pre-race/registrations");
      const inspectionEntries = response.data.data || [];
      setEntries(inspectionEntries);
      setForm((current) => {
        const raceId = current.raceId || inspectionEntries[0]?.raceId || "";
        const firstEntry = inspectionEntries.find((entry) => entry.raceId === raceId && entry.jockeyId);
        return {
          ...current,
          raceId,
          registrationId: current.registrationId || firstEntry?.registrationId || "",
        };
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load referee race context.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadViolations = useCallback(async (raceId) => {
    try {
      const params = raceId ? { raceId } : {};
      const response = await api.get("/referee/violations", { params });
      setViolations(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load violations.");
    }
  }, []);

  useEffect(() => {
    void loadContext();
  }, [loadContext]);

  useEffect(() => {
    if (form.raceId) {
      void loadViolations(form.raceId);
    }
  }, [form.raceId, loadViolations]);

  const updateRace = (raceId) => {
    const firstEntry = entries.find((entry) => entry.raceId === raceId && entry.jockeyId);
    setForm((current) => ({
      ...current,
      raceId,
      registrationId: firstEntry?.registrationId || "",
    }));
    setEditingId(null);
  };

  const resetForm = () => {
    const firstEntry = selectedRaceEntries[0];
    setEditingId(null);
    setForm((current) => ({
      ...emptyForm,
      raceId: current.raceId,
      registrationId: firstEntry?.registrationId || "",
      timestamp: toDatetimeLocal(),
    }));
  };

  const submitViolation = async (event) => {
    event.preventDefault();
    if (!selectedEntry) {
      toast.error("Select a horse and jockey pair before recording a violation.");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required.");
      return;
    }

    setSubmitting(true);
    const payload = {
      raceId: form.raceId,
      horseId: selectedEntry.horseId,
      jockeyId: selectedEntry.jockeyId,
      type: form.type,
      severity: form.severity,
      timestamp: form.timestamp,
      description: form.description.trim(),
    };

    try {
      if (editingId) {
        await api.put(`/referee/violations/${editingId}`, payload);
        toast.success("Violation updated");
      } else {
        await api.post("/referee/violations", payload);
        toast.success("Violation recorded");
      }
      await loadViolations(form.raceId);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not save violation.");
    } finally {
      setSubmitting(false);
    }
  };

  const editViolation = (violation) => {
    const registration = entries.find(
      (entry) =>
        entry.raceId === violation.raceId &&
        entry.horseId === violation.horseId &&
        entry.jockeyId === violation.jockeyId,
    );
    setEditingId(violation.id);
    setForm({
      raceId: violation.raceId,
      registrationId: registration?.registrationId || "",
      type: violation.type,
      severity: violation.severity,
      timestamp: toDatetimeLocal(violation.timestamp),
      description: violation.description,
    });
  };

  const deleteViolation = async (violationId) => {
    try {
      await api.delete(`/referee/violations/${violationId}`);
      toast.success("Violation removed");
      await loadViolations(form.raceId);
      if (editingId === violationId) {
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not delete violation.");
    }
  };

  return (
    <div className="violation-shell">
      <aside className="violation-sidebar">
        <div className="violation-logo">HorseRace</div>
        <nav>
          <a href="/referee">
            <span className="material-symbols-outlined">fact_check</span>
            Pre-race
          </a>
          <a href="/referee/violations" className="violation-active">
            <span className="material-symbols-outlined">flag</span>
            Violations
          </a>
          <a href="/referee/reports">
            <span className="material-symbols-outlined">assignment</span>
            Reports
          </a>
        </nav>
      </aside>

      <main className="violation-main">
        <header className="violation-header">
          <div>
            <p>Race Referee</p>
            <h1>Real-time Violation Log</h1>
          </div>
          <div className="violation-count">
            <strong>{violations.length}</strong>
            <span>records</span>
          </div>
        </header>

        <section className="violation-layout">
          <form className="violation-form" onSubmit={submitViolation}>
            <div className="violation-card-head">
              <div>
                <p>{editingId ? "Edit entry" : "New entry"}</p>
                <h2>{editingId ? "Update Violation" : "Record Violation"}</h2>
              </div>
              {editingId && (
                <button type="button" className="violation-link-button" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>

            <label>
              <span>Race</span>
              <select value={form.raceId} onChange={(event) => updateRace(event.target.value)} required>
                {races.map((race) => (
                  <option key={race.id} value={race.id}>
                    {race.name} - {formatDateTime(race.startTime)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Horse / Jockey</span>
              <select
                value={form.registrationId}
                onChange={(event) => setForm((current) => ({ ...current, registrationId: event.target.value }))}
                required
              >
                {selectedRaceEntries.map((entry) => (
                  <option key={entry.registrationId} value={entry.registrationId}>
                    {entry.horseName} / {entry.jockeyName}
                  </option>
                ))}
              </select>
            </label>

            <div className="violation-two">
              <label>
                <span>Type</span>
                <select
                  value={form.type}
                  onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                >
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Severity</span>
                <select
                  value={form.severity}
                  onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value }))}
                >
                  {severityOptions.map((severity) => (
                    <option key={severity} value={severity}>
                      {severity}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              <span>Timestamp</span>
              <input
                type="datetime-local"
                value={form.timestamp}
                onChange={(event) => setForm((current) => ({ ...current, timestamp: event.target.value }))}
                required
              />
            </label>

            <label>
              <span>Description</span>
              <textarea
                rows="6"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Observed action, position on track, steward notes..."
                required
              />
            </label>

            <button type="submit" disabled={submitting || !selectedEntry}>
              <span className="material-symbols-outlined">{editingId ? "save" : "add_task"}</span>
              {editingId ? "Save Changes" : "Add Violation"}
            </button>

            {!loading && selectedRaceEntries.length === 0 && (
              <div className="violation-form-empty">No horse and jockey pairs are available for this race.</div>
            )}
          </form>

          <section className="violation-log">
            <div className="violation-card-head">
              <div>
                <p>Live log</p>
                <h2>Recorded Violations</h2>
              </div>
            </div>

            <div className="violation-list">
              {violations.map((violation) => (
                <article key={violation.id} className="violation-item">
                  <div className="violation-item-top">
                    <span className={`violation-severity violation-severity-${violation.severity.toLowerCase()}`}>
                      {violation.severity}
                    </span>
                    <time>{formatDateTime(violation.timestamp)}</time>
                  </div>
                  <h3>{violation.type.replaceAll("_", " ")}</h3>
                  <p>{violation.description}</p>
                  <div className="violation-meta">
                    <span>{violation.horseName}</span>
                    <span>{violation.jockeyName}</span>
                  </div>
                  <div className="violation-item-actions">
                    <button type="button" onClick={() => editViolation(violation)}>
                      <span className="material-symbols-outlined">edit</span>
                      Edit
                    </button>
                    <button type="button" className="violation-delete" onClick={() => deleteViolation(violation.id)}>
                      <span className="material-symbols-outlined">delete</span>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {!loading && violations.length === 0 && (
                <div className="violation-empty">No violations recorded for the selected race.</div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default RefereeViolationsPage;
