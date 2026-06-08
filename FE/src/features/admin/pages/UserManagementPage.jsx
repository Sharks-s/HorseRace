import { useCallback, useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { toast } from "../../../shared/components/Toast";
import "./UserManagementPage.css";

const roleOptions = ["", "ADMIN", "HORSE_OWNER", "JOCKEY", "REFEREE", "SPECTATOR"];
const statusOptions = ["", "ACTIVE", "INACTIVE", "PENDING_VERIFICATION", "PENDING_APPROVAL", "SUSPENDED"];

const formatDate = (value) => (value ? new Date(value).toLocaleString("vi-VN") : "-");

const AdminUsersPage = () => {
  const [pageData, setPageData] = useState({
    content: [],
    number: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [filters, setFilters] = useState({ role: "", status: "", page: 0, size: 8 });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      const params = { page: filters.page, size: filters.size };
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;

      const response = await api.get("/admin/users", { params });
      const nextPage = response.data.data;
      setPageData(nextPage);
      setSelectedUser((current) => {
        if (!current) return nextPage.content[0] ?? null;
        return nextPage.content.find((user) => user.id === current.id) ?? nextPage.content[0] ?? null;
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.size, filters.role, filters.status]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const updateStatus = async (userId, status) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { status });
      toast.success("User status updated");
      setSelectedUser(response.data.data);
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not update status.");
    }
  };

  const updateRole = async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      toast.success("User role updated");
      setSelectedUser(response.data.data);
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Could not update role.");
    }
  };

  const users = pageData.content || [];
  const activeCount = users.filter((user) => user.status === "ACTIVE").length;
  const pendingCount = users.filter((user) => user.status?.startsWith("PENDING")).length;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">HorseRace</div>
        <nav className="admin-nav">
          <a className="admin-nav-link admin-nav-link-active" href="#users">
            <span className="material-symbols-outlined">group</span>
            <span>Users</span>
          </a>
          <a className="admin-nav-link" href="#roles">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span>Roles</span>
          </a>
          <a className="admin-nav-link" href="#access">
            <span className="material-symbols-outlined">fact_check</span>
            <span>Access</span>
          </a>
        </nav>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div className="admin-mobile-title">
            <span className="material-symbols-outlined">menu</span>
            <strong>Admin Portal</strong>
          </div>
          <div className="admin-topbar-actions">
            <span className="material-symbols-outlined">notifications</span>
            <div className="admin-avatar">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <section className="admin-stats">
            <article className="admin-stat-card">
              <span className="material-symbols-outlined">groups</span>
              <p>Total Users</p>
              <strong>{pageData.totalElements}</strong>
            </article>
            <article className="admin-stat-card">
              <span className="material-symbols-outlined">verified_user</span>
              <p>Active On Page</p>
              <strong>{activeCount}</strong>
            </article>
            <article className="admin-stat-card">
              <span className="material-symbols-outlined">hourglass_empty</span>
              <p>Pending On Page</p>
              <strong>{pendingCount}</strong>
            </article>
            <article className="admin-stat-card admin-stat-card-alert">
              <span className="material-symbols-outlined">manage_accounts</span>
              <p>Page</p>
              <strong>{pageData.number + 1}</strong>
            </article>
          </section>

          <section className="admin-grid">
            <div className="admin-table-panel" id="users">
              <div className="admin-section-header">
                <div>
                  <p>User Administration</p>
                  <h1>Account Access Control</h1>
                </div>
                <button
                  type="button"
                  className="admin-reset-button"
                  onClick={() => {
                    setFilters({ role: "", status: "", page: 0, size: 8 });
                    setSelectedUser(null);
                  }}
                >
                  <span className="material-symbols-outlined">filter_alt_off</span>
                  Reset
                </button>
              </div>

              <div className="admin-filters">
                <select
                  value={filters.role}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, role: event.target.value, page: 0 }))
                  }
                >
                  <option value="">All roles</option>
                  {roleOptions.filter(Boolean).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, status: event.target.value, page: 0 }))
                  }
                >
                  <option value="">All statuses</option>
                  {statusOptions.filter(Boolean).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.size}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, size: Number(event.target.value), page: 0 }))
                  }
                >
                  {[5, 8, 10, 20].map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className={selectedUser?.id === user.id ? "admin-row-selected" : ""}
                        onClick={() => setSelectedUser(user)}
                      >
                        <td>
                          <strong>{user.username}</strong>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <span className={`admin-status admin-status-${user.status?.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{formatDate(user.lastLoginAt)}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                updateStatus(user.id, user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
                              }}
                            >
                              {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                            </button>
                            <select
                              value={user.role}
                              onClick={(event) => event.stopPropagation()}
                              onChange={(event) => {
                                event.stopPropagation();
                                updateRole(user.id, event.target.value);
                              }}
                            >
                              {roleOptions.filter(Boolean).map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!loading && users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="admin-empty">
                          No users match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                <span>
                  Page {pageData.number + 1} / {Math.max(pageData.totalPages, 1)}
                </span>
                <div>
                  <button
                    type="button"
                    disabled={pageData.number <= 0}
                    onClick={() => setFilters((current) => ({ ...current, page: Math.max(current.page - 1, 0) }))}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={pageData.number + 1 >= pageData.totalPages}
                    onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <aside className="admin-detail-panel">
              <div className="admin-section-header admin-detail-header">
                <div>
                  <p>Selected Account</p>
                  <h2>User Detail</h2>
                </div>
              </div>

              {selectedUser ? (
                <div className="admin-detail-stack">
                  <div className="admin-profile-card">
                    <div className="admin-profile-avatar">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <h3>{selectedUser.username}</h3>
                    <p>{selectedUser.email}</p>
                    <span className={`admin-status admin-status-${selectedUser.status?.toLowerCase()}`}>
                      {selectedUser.status}
                    </span>
                  </div>

                  <div className="admin-detail-card">
                    <label>Quick Status</label>
                    <div className="admin-detail-actions">
                      <button type="button" onClick={() => updateStatus(selectedUser.id, "ACTIVE")}>
                        Activate
                      </button>
                      <button type="button" className="admin-danger" onClick={() => updateStatus(selectedUser.id, "INACTIVE")}>
                        Disable
                      </button>
                    </div>
                  </div>

                  <div className="admin-detail-card">
                    <label>Role</label>
                    <select value={selectedUser.role} onChange={(event) => updateRole(selectedUser.id, event.target.value)}>
                      {roleOptions.filter(Boolean).map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-meta">
                    <span>Verified</span>
                    <strong>{formatDate(selectedUser.emailVerifiedAt)}</strong>
                    <span>Created</span>
                    <strong>{formatDate(selectedUser.createdAt)}</strong>
                    <span>Updated</span>
                    <strong>{formatDate(selectedUser.updatedAt)}</strong>
                    <span>Last Login</span>
                    <strong>{formatDate(selectedUser.lastLoginAt)}</strong>
                  </div>
                </div>
              ) : (
                <div className="admin-empty-card">Select a user to inspect account details.</div>
              )}
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminUsersPage;
