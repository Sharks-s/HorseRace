import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../../api/axios";
import { toast } from "../../../shared/components/Toast";
import "./HorseManagementPage.css";

const horseStatusOptions = ["", "PENDING_REVIEW", "APPROVED", "REJECTED", "REGISTERED"];
const MAX_HORSE_WEIGHT = 650;

const initialForm = {
  name: "",
  breed: "",
  age: "",
  weight: "",
  healthCertExpiry: "",
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("vi-VN") : "-");

const isHealthCertValid = (value) => {
  if (!value) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(value) >= today;
};

const HorseManagementPage = () => {
  const [horses, setHorses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingHorseId, setEditingHorseId] = useState(null);

  const loadHorses = useCallback(async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await api.get("/owner/horses", { params });
      setHorses(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load your stable.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void loadHorses();
  }, [loadHorses]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingHorseId(null);
  };

  const submitHorse = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      age: Number(form.age),
      weight: Number(form.weight),
    };

    try {
      if (editingHorseId) {
        await api.put(`/owner/horses/${editingHorseId}`, payload);
        toast.success("Horse profile updated");
      } else {
        await api.post("/owner/horses", payload);
        toast.success("Horse profile submitted for review");
      }
      resetForm();
      await loadHorses();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not save horse profile.");
    }
  };

  const startEdit = (horse) => {
    if (horse.status === "REGISTERED") {
      toast.error("Registered horses cannot be edited.");
      return;
    }

    setEditingHorseId(horse.id);
    setForm({
      name: horse.name,
      breed: horse.breed,
      age: String(horse.age),
      weight: String(horse.weight),
      healthCertExpiry: horse.healthCertExpiry,
    });
  };

  const statusCounts = useMemo(
    () =>
      horses.reduce(
        (counts, horse) => ({
          ...counts,
          [horse.status]: (counts[horse.status] || 0) + 1,
        }),
        {},
      ),
    [horses],
  );

  return (
    <div className="owner-shell">
      <header className="owner-topbar">
        <div className="owner-brand">HorseRace</div>
        <nav className="owner-nav">
          <a href="#stable" className="owner-nav-active">My Stable</a>
          <a href="#form">Horse Profile</a>
          <a href="#rules">BR-01</a>
        </nav>
        <div className="owner-avatar">
          <span className="material-symbols-outlined">person</span>
        </div>
      </header>

      <main className="owner-main">
        <section className="owner-hero">
          <div>
            <p>Owner Workspace</p>
            <h1>Manage Your Racing Stable</h1>
          </div>
          <a href="#form" className="owner-add-button">
            <span className="material-symbols-outlined">add</span>
            Add New Horse
          </a>
        </section>

        <section className="owner-grid">
          <div className="owner-stable" id="stable">
            <div className="owner-section-title">
              <div>
                <h2>My Stable</h2>
                <p>{loading ? "Loading stable..." : `${horses.length} profile(s)`}</p>
              </div>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">All statuses</option>
                {horseStatusOptions.filter(Boolean).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="owner-table-card">
              <table className="owner-table">
                <thead>
                  <tr>
                    <th>Horse</th>
                    <th>Details</th>
                    <th>Weight</th>
                    <th>Health Cert</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {horses.map((horse, index) => {
                    const validCert = isHealthCertValid(horse.healthCertExpiry);
                    return (
                      <tr key={horse.id}>
                        <td>
                          <div className="owner-horse-cell">
                            <div className={`owner-horse-avatar owner-horse-avatar-${index % 3}`}>
                              <span className="material-symbols-outlined">pets</span>
                            </div>
                            <strong>{horse.name}</strong>
                          </div>
                        </td>
                        <td>
                          {horse.breed} <span className="owner-dot">.</span> {horse.age} yrs
                        </td>
                        <td>{horse.weight} kg</td>
                        <td>
                          <span className={`owner-cert ${validCert ? "owner-cert-valid" : "owner-cert-expired"}`}>
                            <span className="material-symbols-outlined">
                              {validCert ? "check_circle" : "warning"}
                            </span>
                            {formatDate(horse.healthCertExpiry)}
                          </span>
                        </td>
                        <td>
                          <span className={`owner-status owner-status-${horse.status?.toLowerCase()}`}>
                            {horse.status}
                          </span>
                        </td>
                        <td>
                          <button type="button" className="owner-edit-button" onClick={() => startEdit(horse)}>
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {!loading && horses.length === 0 && (
                    <tr>
                      <td colSpan="6" className="owner-empty">
                        No horse profiles yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="owner-side">
            <section className="owner-form-card" id="form">
              <div className="owner-form-heading">
                <p>{editingHorseId ? "Update Profile" : "Submission Form"}</p>
                <h2>{editingHorseId ? "Edit Horse" : "Add Horse"}</h2>
              </div>

              <form className="owner-form" onSubmit={submitHorse}>
                <label>
                  <span>Name</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Thunder Strike"
                    required
                  />
                </label>
                <label>
                  <span>Breed</span>
                  <input
                    value={form.breed}
                    onChange={(event) => setForm((current) => ({ ...current, breed: event.target.value }))}
                    placeholder="Thoroughbred"
                    required
                  />
                </label>
                <div className="owner-form-row">
                  <label>
                    <span>Age</span>
                    <input
                      type="number"
                      min="1"
                      value={form.age}
                      onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                      placeholder="4"
                      required
                    />
                  </label>
                  <label>
                    <span>Weight</span>
                    <input
                      type="number"
                      min="0.1"
                      max={MAX_HORSE_WEIGHT}
                      step="0.1"
                      value={form.weight}
                      onChange={(event) => setForm((current) => ({ ...current, weight: event.target.value }))}
                      placeholder="520"
                      required
                    />
                  </label>
                </div>
                <label>
                  <span>Health Cert Expiry</span>
                  <input
                    type="date"
                    value={form.healthCertExpiry}
                    onChange={(event) => setForm((current) => ({ ...current, healthCertExpiry: event.target.value }))}
                    required
                  />
                </label>

                <div className="owner-form-actions">
                  <button type="submit">
                    <span className="material-symbols-outlined">
                      {editingHorseId ? "save" : "how_to_reg"}
                    </span>
                    {editingHorseId ? "Update" : "Submit"}
                  </button>
                  {editingHorseId && (
                    <button type="button" className="owner-cancel-button" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="owner-rules-card" id="rules">
              <div className="owner-rule-header">
                <span className="material-symbols-outlined">fact_check</span>
                <div>
                  <h3>BR-01</h3>
                  <p>Eligibility checks</p>
                </div>
              </div>
              <ul>
                <li>Health certificate expiry must be within 6 months from today.</li>
                <li>Weight must be greater than 0 and no more than {MAX_HORSE_WEIGHT} kg.</li>
                <li>New horses are submitted with PENDING_REVIEW status.</li>
              </ul>
              <div className="owner-status-summary">
                <span>Pending</span>
                <strong>{statusCounts.PENDING_REVIEW || 0}</strong>
                <span>Approved</span>
                <strong>{statusCounts.APPROVED || 0}</strong>
                <span>Registered</span>
                <strong>{statusCounts.REGISTERED || 0}</strong>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default HorseManagementPage;
