import { useCallback, useEffect, useState } from 'react';
import { adminResultApi } from '../../../api/adminResultApi';
import './AdminResultPage.css';

const AdminResultPage = () => {
  const [pendingRaces, setPendingRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedRaceId, setExpandedRaceId] = useState(null);
  const [confirmRaceId, setConfirmRaceId] = useState(null);

  const loadPendingRaces = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminResultApi.getPendingRaces();
      setPendingRaces(res?.data || []);
    } catch {
      setError('Failed to load pending race results.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialPendingRaces = async () => {
      setLoading(true);
      try {
        const res = await adminResultApi.getPendingRaces();
        setPendingRaces(res?.data || []);
      } catch {
        setError('Failed to load pending race results.');
      } finally {
        setLoading(false);
      }
    };

    void loadInitialPendingRaces();
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

  const formatDate = (date) => (date ? new Date(date).toLocaleString('vi-VN') : '-');

  return (
    <div className="admin-result-page">
      <div className="admin-result-container">
        <section className="admin-result-header">
          <div>
            <p>Admin Approval</p>
            <h2>Official Results</h2>
          </div>
          <span className="admin-result-rule">
            <span className="material-symbols-outlined">verified</span>
            BR-05
          </span>
        </section>

        <section className="admin-result-stats">
          <article className="admin-result-stat-card">
            <span className="material-symbols-outlined">pending_actions</span>
            <p>Pending</p>
            <strong>{pendingRaces.length}</strong>
          </article>

          <article className="admin-result-stat-card admin-result-stat-warning">
            <span className="material-symbols-outlined">task_alt</span>
            <p>Action Required</p>
            <strong>{pendingRaces.length > 0 ? '!' : 'OK'}</strong>
          </article>

          <article className="admin-result-stat-card admin-result-stat-note">
            <span className="material-symbols-outlined">fact_check</span>
            <p>BR-05 Status</p>
            <strong>Referee report required before publication.</strong>
          </article>
        </section>

        {error && <div className="admin-result-alert admin-result-alert-error">{error}</div>}
        {success && <div className="admin-result-alert admin-result-alert-success">{success}</div>}

        <section className="admin-result-panel">
          <div className="admin-result-panel-head">
            <div>
              <p>Review queue</p>
              <h3>Pending Approval ({pendingRaces.length})</h3>
            </div>
          </div>

          {loading && <div className="admin-result-empty">Loading pending race results...</div>}

          {!loading && pendingRaces.length === 0 && (
            <div className="admin-result-empty admin-result-empty-success">
              <span className="material-symbols-outlined">check_circle</span>
              <p>No pending results. All race results have been published.</p>
            </div>
          )}

          <div className="admin-result-list">
            {pendingRaces.map((race) => (
              <article key={race.id} className="admin-result-race-card">
                <div className="admin-result-race-content">
                  <div className="admin-result-race-main">
                    <div className="admin-result-meta">
                      <span className="admin-result-status">Pending Approval</span>
                      <span className="admin-result-date">
                        <span className="material-symbols-outlined">calendar_today</span>
                        {formatDate(race.startTime)}
                      </span>
                    </div>

                    <h3>{race.name}</h3>
                    <p>
                      Status: <strong>{race.status}</strong>
                      {race.refereeName && <span> Referee: {race.refereeName}</span>}
                    </p>
                  </div>

                  <div className="admin-result-actions">
                    <button
                      type="button"
                      onClick={() => setExpandedRaceId(expandedRaceId === race.id ? null : race.id)}
                      className="admin-result-secondary"
                    >
                      {expandedRaceId === race.id ? 'Hide Details' : 'View Report'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmRaceId(race.id)}
                      disabled={publishing === race.id}
                      className="admin-result-primary"
                    >
                      <span className="material-symbols-outlined">publish</span>
                      {publishing === race.id ? 'Publishing...' : 'Publish Official'}
                    </button>
                  </div>
                </div>

                {expandedRaceId === race.id && (
                  <div className="admin-result-details">
                    <div>
                      <span>Race ID</span>
                      <strong>{race.id}</strong>
                    </div>
                    <div>
                      <span>Referee</span>
                      <strong>{race.refereeName || 'Unassigned'}</strong>
                    </div>
                    <div>
                      <span>Submitted Status</span>
                      <strong>{race.status || '-'}</strong>
                    </div>
                  </div>
                )}

                {confirmRaceId === race.id && (
                  <div className="admin-result-confirm">
                    <span className="material-symbols-outlined">warning</span>
                    <div>
                      <h4>Confirm Publish</h4>
                      <p>
                        Publishing these results will make them official and visible to all users. This action cannot
                        be undone.
                      </p>
                      <div className="admin-result-confirm-actions">
                        <button type="button" onClick={() => handlePublish(race.id)} className="admin-result-danger">
                          Confirm & Publish
                        </button>
                        <button type="button" onClick={() => setConfirmRaceId(null)} className="admin-result-cancel">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminResultPage;
