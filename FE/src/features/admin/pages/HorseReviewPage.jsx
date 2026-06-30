import { useCallback, useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { toast } from "../../../shared/components/Toast";
import "./HorseReviewPage.css";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("vi-VN") : "-");

const HorseReviewPage = () => {
  const [pageData, setPageData] = useState({ content: [], number: 0, totalPages: 0, totalElements: 0 });
  const [filters, setFilters] = useState({ createdFrom: "", createdTo: "", page: 0, size: 8 });
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPendingHorses = useCallback(async () => {
    try {
      const params = { page: filters.page, size: filters.size };
      if (filters.createdFrom) params.createdFrom = filters.createdFrom;
      if (filters.createdTo) params.createdTo = filters.createdTo;
      const response = await api.get("/admin/horses/pending", { params });
      const nextPage = response.data.data;
      setPageData(nextPage);
      setSelectedHorse((current) => {
        if (!current) return nextPage.content[0] ?? null;
        return nextPage.content.find((horse) => horse.id === current.id) ?? nextPage.content[0] ?? null;
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load pending horses.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadPendingHorses();
  }, [loadPendingHorses]);

  const approveHorse = async (horseId) => {
    try {
      await api.put(`/admin/horses/${horseId}/approve`);
      toast.success("Horse profile approved");
      setRejectReason("");
      await loadPendingHorses();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not approve horse.");
    }
  };

  const rejectHorse = async (horseId) => {
    if (!rejectReason.trim()) {
      toast.error("Reject reason is required.");
      return;
    }
    try {
      await api.put(`/admin/horses/${horseId}/reject`, { reason: rejectReason.trim() });
      toast.success("Horse profile rejected");
      setRejectReason("");
      await loadPendingHorses();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not reject horse.");
    }
  };

  const horses = pageData.content || [];

  return (
    <main className="review-main" style={{ padding: "24px" }}>
      <header className="review-header">
        <div>
          <p>Admin Quality Gate</p>
          <h1>Pending Horse Registrations</h1>
        </div>
        <div className="review-total">
          <span className="material-symbols-outlined">pending_actions</span>
          <strong>{pageData.totalElements}</strong>
          <small>pending</small>
        </div>
      </header>

      <section className="review-grid">
        <div className="review-list">
          <div className="review-filter-card">
            <label>
              <span>Created From</span>
              <input
                type="date"
                value={filters.createdFrom}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, createdFrom: event.target.value, page: 0 }))
                }
              />
            </label>
            <label>
              <span>Created To</span>
              <input
                type="date"
                value={filters.createdTo}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, createdTo: event.target.value, page: 0 }))
                }
              />
            </label>
            <button
              type="button"
              onClick={() => setFilters({ createdFrom: "", createdTo: "", page: 0, size: 8 })}
            >
              <span className="material-symbols-outlined">filter_alt_off</span>
              Reset
            </button>
          </div>

          <div className="review-table-card">
            <table>
              <thead>
                <tr>
                  <th>Horse</th>
                  <th>Owner</th>
                  <th>Created</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {horses.map((horse) => (
                  <tr
                    key={horse.id}
                    className={selectedHorse?.id === horse.id ? "review-selected-row" : ""}
                    onClick={() => setSelectedHorse(horse)}
                  >
                    <td>
                      <strong>{horse.name}</strong>
                      <span>{horse.breed}</span>
                    </td>
                    <td>{horse.ownerUsername}</td>
                    <td>{formatDate(horse.createdAt)}</td>
                    <td>
                      <span className="review-status">{horse.status}</span>
                    </td>
                  </tr>
                ))}
                {!loading && horses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="review-empty">
                      No pending horse profiles match the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="review-pagination">
            <span>
              Page {pageData.number + 1} / {Math.max(pageData.totalPages, 1)}
            </span>
            <div>
              <button
                disabled={pageData.number <= 0}
                onClick={() => setFilters((current) => ({ ...current, page: Math.max(current.page - 1, 0) }))}
              >
                Previous
              </button>
              <button
                disabled={pageData.number + 1 >= pageData.totalPages}
                onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <aside className="review-detail">
          {selectedHorse ? (
            <>
              <div className="review-detail-hero">
                <div className="review-horse-icon">
                  <span className="material-symbols-outlined">pets</span>
                </div>
                <h2>{selectedHorse.name}</h2>
                <p>{selectedHorse.ownerEmail}</p>
                <span className="review-status">{selectedHorse.status}</span>
              </div>

              <div className="review-facts">
                <span>Breed</span>
                <strong>{selectedHorse.breed}</strong>
                <span>Weight</span>
                <strong>{selectedHorse.weight} kg</strong>
                <span>Age</span>
                <strong>{selectedHorse.age} yrs</strong>
                <span>Health Cert</span>
                <strong>{formatDate(selectedHorse.healthCertExpiry)}</strong>
                <span>Created</span>
                <strong>{formatDate(selectedHorse.createdAt)}</strong>
              </div>

              <div className="review-actions">
                <button type="button" onClick={() => approveHorse(selectedHorse.id)}>
                  <span className="material-symbols-outlined">check_circle</span>
                  Approve
                </button>
                <textarea
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                  placeholder="Reject reason..."
                  rows="4"
                />
                <button type="button" className="review-reject" onClick={() => rejectHorse(selectedHorse.id)}>
                  <span className="material-symbols-outlined">cancel</span>
                  Reject
                </button>
              </div>
            </>
          ) : (
            <div className="review-empty-panel">Select a pending horse profile to review.</div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default HorseReviewPage;
