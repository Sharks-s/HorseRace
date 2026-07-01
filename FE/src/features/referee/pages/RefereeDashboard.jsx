import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../../api/axios";
import { toast } from "../../../shared/components/Toast";
import "./RefereeDashboard.css";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("vi-VN") : "-");
const formatDateTime = (value) => (value ? new Date(value).toLocaleString("vi-VN") : "-");

const statusLabels = {
  ACCEPTED: "Pending",
  RACE_READY: "Race ready",
  DISQUALIFIED: "Disqualified",
};

const RefereeDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadInspections = useCallback(async () => {
    try {
      const response = await api.get("/referee/pre-race/registrations");
      const items = response.data.data || [];
      setRegistrations(items);
      setSelectedId((current) => current || items[0]?.registrationId || null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load pre-race inspections.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInspections();
  }, [loadInspections]);

  const filteredRegistrations = useMemo(() => {
    if (statusFilter === "ALL") return registrations;
    return registrations.filter((item) => item.status === statusFilter);
  }, [registrations, statusFilter]);

  const selectedInspection = useMemo(
    () => registrations.find((item) => item.registrationId === selectedId) || filteredRegistrations[0] || null,
    [filteredRegistrations, registrations, selectedId],
  );

  useEffect(() => {
    setNote(selectedInspection?.inspectionNote || "");
  }, [selectedInspection?.registrationId, selectedInspection?.inspectionNote]);

  const inspectHorse = async (decision) => {
    if (!selectedInspection || submitting) return;

    setSubmitting(true);
    try {
      const response = await api.put(`/referee/pre-race/registrations/${selectedInspection.registrationId}/inspect`, {
        decision,
        note: note.trim(),
      });
      const updated = response.data.data;
      setRegistrations((current) =>
        current.map((item) => (item.registrationId === updated.registrationId ? updated : item)),
      );
      setSelectedId(updated.registrationId);
      toast.success(decision === "PASSED" ? "Horse marked race ready" : "Horse disqualified");
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not submit inspection.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalReady = registrations.filter((item) => item.status === "RACE_READY").length;
  const totalDisqualified = registrations.filter((item) => item.status === "DISQUALIFIED").length;

  return (
    <div className="referee-shell" style={{ display: "block" }}>
      <main className="referee-main" style={{ padding: "24px" }}>
        <header className="referee-header">
          <div>
            <p>Race Referee</p>
            <h1>Pre-race Horse Inspection</h1>
          </div>
          <div className="referee-stats">
            <div>
              <strong>{registrations.length}</strong>
              <span>assigned</span>
            </div>
            <div>
              <strong>{totalReady}</strong>
              <span>ready</span>
            </div>
            <div>
              <strong>{totalDisqualified}</strong>
              <span>failed</span>
            </div>
          </div>
        </header>

        <section className="referee-grid">
          <div className="referee-list">
            <div className="referee-toolbar">
              {["ALL", "ACCEPTED", "RACE_READY", "DISQUALIFIED"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={statusFilter === status ? "referee-filter-active" : ""}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "ALL" ? "All" : statusLabels[status]}
                </button>
              ))}
            </div>

            <div className="referee-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Race</th>
                    <th>Horse</th>
                    <th>BR-01</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((item) => (
                    <tr
                      key={item.registrationId}
                      className={selectedInspection?.registrationId === item.registrationId ? "referee-row-active" : ""}
                      onClick={() => setSelectedId(item.registrationId)}
                    >
                      <td>
                        <strong>{item.raceName}</strong>
                        <span>{formatDateTime(item.raceStartTime)}</span>
                      </td>
                      <td>
                        <strong>{item.horseName}</strong>
                        <span>{item.ownerUsername}</span>
                      </td>
                      <td>
                        <span className={item.br01Passed ? "referee-pill referee-ok" : "referee-pill referee-bad"}>
                          {item.br01Passed ? "Passed" : "Failed"}
                        </span>
                      </td>
                      <td>
                        <span className={`referee-status referee-status-${item.status.toLowerCase()}`}>
                          {statusLabels[item.status] || item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredRegistrations.length === 0 && (
                    <tr>
                      <td colSpan="4" className="referee-empty">
                        No horses match this inspection view.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="referee-detail">
            {selectedInspection ? (
              <>
                <div className="referee-detail-head">
                  <div className="referee-horse-mark">
                    <span className="material-symbols-outlined">pets</span>
                  </div>
                  <div>
                    <p>{selectedInspection.tournamentName}</p>
                    <h2>{selectedInspection.horseName}</h2>
                    <span>{selectedInspection.raceName}</span>
                  </div>
                </div>

                <div className="referee-checks">
                  <div className={selectedInspection.healthCertValid ? "referee-check-ok" : "referee-check-bad"}>
                    <span className="material-symbols-outlined">
                      {selectedInspection.healthCertValid ? "verified" : "warning"}
                    </span>
                    <div>
                      <strong>Health certificate</strong>
                      <p>Expires {formatDate(selectedInspection.healthCertExpiry)}</p>
                    </div>
                  </div>
                  <div className={selectedInspection.weightValid ? "referee-check-ok" : "referee-check-bad"}>
                    <span className="material-symbols-outlined">
                      {selectedInspection.weightValid ? "verified" : "warning"}
                    </span>
                    <div>
                      <strong>Weight</strong>
                      <p>
                        {selectedInspection.weight} kg, limit {selectedInspection.minWeight}-{selectedInspection.maxWeight} kg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="referee-facts">
                  <span>Breed</span>
                  <strong>{selectedInspection.breed}</strong>
                  <span>Age</span>
                  <strong>{selectedInspection.age} yrs</strong>
                  <span>Jockey</span>
                  <strong>{selectedInspection.jockeyName || "Unassigned"}</strong>
                  <span>Last inspection</span>
                  <strong>{formatDateTime(selectedInspection.inspectedAt)}</strong>
                </div>

                <label className="referee-note">
                  <span>Inspection note</span>
                  <textarea
                    value={note}
                    rows="5"
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Condition notes, document references, race-day observations..."
                  />
                </label>

                <div className="referee-actions">
                  <button
                    type="button"
                    disabled={submitting || !selectedInspection.br01Passed}
                    onClick={() => inspectHorse("PASSED")}
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    Mark Passed
                  </button>
                  <button
                    type="button"
                    className="referee-fail"
                    disabled={submitting}
                    onClick={() => inspectHorse("FAILED")}
                  >
                    <span className="material-symbols-outlined">cancel</span>
                    Mark Failed
                  </button>
                </div>
              </>
            ) : (
              <div className="referee-empty-panel">No assigned horses are ready for inspection.</div>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
};

export default RefereeDashboard;
