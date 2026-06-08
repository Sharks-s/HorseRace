import { useCallback, useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { toast } from "../../../shared/components/Toast";

const roleOptions = ["", "ADMIN", "HORSE_OWNER", "JOCKEY", "REFEREE", "SPECTATOR"];
const statusOptions = ["", "ACTIVE", "INACTIVE", "PENDING_VERIFICATION", "PENDING_APPROVAL", "SUSPENDED"];

const formatDate = (value) => (value ? new Date(value).toLocaleString("vi-VN") : "-");

const badgeStyle = (status) => {
  const palette = {
    ACTIVE: { background: "#dcfce7", color: "#166534" },
    INACTIVE: { background: "#fee2e2", color: "#991b1b" },
    PENDING_VERIFICATION: { background: "#fef3c7", color: "#92400e" },
    PENDING_APPROVAL: { background: "#e0e7ff", color: "#3730a3" },
    SUSPENDED: { background: "#e5e7eb", color: "#374151" },
  };

  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    ...(palette[status] || { background: "#e5e7eb", color: "#111827" }),
  };
};

const AdminUsersPage = () => {
  const [pageData, setPageData] = useState({ content: [], number: 0, totalPages: 0, totalElements: 0 });
  const [filters, setFilters] = useState({ role: "", status: "", page: 0, size: 8 });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      const params = {
        page: filters.page,
        size: filters.size,
      };

      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;

      const response = await api.get("/admin/users", { params });
      setPageData(response.data.data);

      setSelectedUser((current) => current ?? response.data.data.content[0] ?? null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Không tải được danh sách user.");
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.size, filters.role, filters.status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  const updateStatus = async (userId, status) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status });
      toast.success("Cập nhật trạng thái thành công");
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Không thể cập nhật trạng thái.");
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      toast.success("Cập nhật role thành công");
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Không thể cập nhật role.");
    }
  };

  const currentUsers = pageData.content || [];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)", color: "#0f172a" }}>
      <div style={{ maxWidth: "1480px", margin: "0 auto", padding: "32px 20px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
          <div>
            <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.18em", color: "#64748b", fontSize: "12px" }}>Admin Console</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "34px", lineHeight: 1.1 }}>Quản lý tài khoản người dùng</h1>
            <p style={{ margin: "8px 0 0", color: "#475569" }}>Lọc theo role/status, xem chi tiết và điều chỉnh quyền truy cập.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px", minWidth: "280px" }}>
            <div style={summaryCardStyle}><span style={summaryLabelStyle}>Tổng số</span><strong style={summaryValueStyle}>{pageData.totalElements}</strong></div>
            <div style={summaryCardStyle}><span style={summaryLabelStyle}>Trang hiện tại</span><strong style={summaryValueStyle}>{pageData.number + 1}</strong></div>
            <div style={summaryCardStyle}><span style={summaryLabelStyle}>Kích thước</span><strong style={summaryValueStyle}>{filters.size}</strong></div>
          </div>
        </div>

        <div style={toolbarStyle}>
          <select value={filters.role} onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value, page: 0 }))} style={selectStyle}>
            <option value="">Tất cả role</option>
            {roleOptions.filter(Boolean).map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 0 }))} style={selectStyle}>
            <option value="">Tất cả status</option>
            {statusOptions.filter(Boolean).map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <select value={filters.size} onChange={(e) => setFilters((prev) => ({ ...prev, size: Number(e.target.value), page: 0 }))} style={selectStyle}>
            {[5, 8, 10, 20].map((size) => <option key={size} value={size}>{size} / trang</option>)}
          </select>
          <button onClick={() => { setFilters({ role: "", status: "", page: 0, size: 8 }); setSelectedUser(null); }} style={ghostButtonStyle}>Xóa bộ lọc</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.9fr)", gap: "20px", alignItems: "start" }}>
          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <h2 style={panelTitleStyle}>Danh sách user</h2>
                <p style={panelSubtitleStyle}>{loading ? "Đang tải dữ liệu..." : `${currentUsers.length} bản ghi trên trang này`}</p>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    <th style={thStyle}>Username</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Last login</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id} style={{ borderTop: "1px solid #e2e8f0", cursor: "pointer", background: selectedUser?.id === user.id ? "#eff6ff" : "transparent" }} onClick={() => setSelectedUser(user)}>
                      <td style={tdStyle}><strong>{user.username}</strong></td>
                      <td style={tdStyle}>{user.email}</td>
                      <td style={tdStyle}>{user.role}</td>
                      <td style={tdStyle}><span style={badgeStyle(user.status)}>{user.status}</span></td>
                      <td style={tdStyle}>{formatDate(user.lastLoginAt)}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(user.id, user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"); }} style={actionButtonStyle}>
                            {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>
                          <select
                            value={user.role}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateRole(user.id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ ...selectStyle, padding: "8px 10px" }}
                          >
                            {roleOptions.filter(Boolean).map((role) => <option key={role} value={role}>{role}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && currentUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>Không có user nào phù hợp với bộ lọc hiện tại.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
              <p style={{ margin: 0, color: "#64748b" }}>Trang {pageData.number + 1} / {Math.max(pageData.totalPages, 1)}</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button disabled={pageData.number <= 0} onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(prev.page - 1, 0) }))} style={paginationButtonStyle(pageData.number <= 0)}>Trang trước</button>
                <button disabled={pageData.number + 1 >= pageData.totalPages} onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))} style={paginationButtonStyle(pageData.number + 1 >= pageData.totalPages)}>Trang sau</button>
              </div>
            </div>
          </section>

          <aside style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <h2 style={panelTitleStyle}>Chi tiết tài khoản</h2>
                <p style={panelSubtitleStyle}>Xem nhanh thông tin và trạng thái kích hoạt.</p>
              </div>
            </div>

            {selectedUser ? (
              <div style={{ display: "grid", gap: "14px" }}>
                <div style={detailCardStyle}>
                  <p style={detailLabelStyle}>Username</p>
                  <strong style={detailValueStyle}>{selectedUser.username}</strong>
                  <p style={detailLabelStyle}>Email</p>
                  <strong style={detailValueStyle}>{selectedUser.email}</strong>
                  <p style={detailLabelStyle}>Role hiện tại</p>
                  <strong style={detailValueStyle}>{selectedUser.role}</strong>
                  <p style={detailLabelStyle}>Trạng thái</p>
                  <span style={badgeStyle(selectedUser.status)}>{selectedUser.status}</span>
                </div>

                <div style={detailCardStyle}>
                  <p style={detailLabelStyle}>Cập nhật nhanh</p>
                  <div style={{ display: "grid", gap: "10px" }}>
                    <button onClick={() => updateStatus(selectedUser.id, "ACTIVE")} style={primaryButtonStyle}>Kích hoạt tài khoản</button>
                    <button onClick={() => updateStatus(selectedUser.id, "INACTIVE")} style={dangerButtonStyle}>Vô hiệu hóa tài khoản</button>
                    <select value={selectedUser.role} onChange={(e) => updateRole(selectedUser.id, e.target.value)} style={selectStyle}>
                      {roleOptions.filter(Boolean).map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                </div>

                <div style={detailCardStyle}>
                  <p style={detailLabelStyle}>Metadata</p>
                  <div style={metaGridStyle}>
                    <span>Verified at</span><strong>{formatDate(selectedUser.emailVerifiedAt)}</strong>
                    <span>Created at</span><strong>{formatDate(selectedUser.createdAt)}</strong>
                    <span>Updated at</span><strong>{formatDate(selectedUser.updatedAt)}</strong>
                    <span>Last login</span><strong>{formatDate(selectedUser.lastLoginAt)}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: "#64748b" }}>Chưa có tài khoản nào được chọn.</div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

const summaryCardStyle = {
  background: "white",
  borderRadius: "18px",
  padding: "14px",
  border: "1px solid rgba(148,163,184,0.2)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
};

const summaryLabelStyle = { display: "block", color: "#64748b", fontSize: "12px", marginBottom: "6px" };
const summaryValueStyle = { fontSize: "24px", lineHeight: 1, color: "#0f172a" };
const toolbarStyle = { display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" };
const panelStyle = { background: "rgba(255,255,255,0.9)", borderRadius: "24px", border: "1px solid rgba(148,163,184,0.18)", padding: "20px", boxShadow: "0 12px 30px rgba(15,23,42,0.07)" };
const panelHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" };
const panelTitleStyle = { margin: 0, fontSize: "22px" };
const panelSubtitleStyle = { margin: "6px 0 0", color: "#64748b" };
const selectStyle = { padding: "12px 14px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", minWidth: "160px" };
const ghostButtonStyle = { padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer", fontWeight: 700 };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { padding: "14px 12px", whiteSpace: "nowrap" };
const tdStyle = { padding: "14px 12px", verticalAlign: "middle" };
const actionButtonStyle = { padding: "8px 12px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", fontWeight: 700 };
const paginationButtonStyle = (disabled) => ({ padding: "10px 14px", borderRadius: "12px", border: "none", background: disabled ? "#cbd5e1" : "#0f172a", color: "white", cursor: disabled ? "not-allowed" : "pointer", fontWeight: 700 });
const detailCardStyle = { background: "#f8fafc", borderRadius: "18px", padding: "16px", border: "1px solid #e2e8f0" };
const detailLabelStyle = { margin: "0 0 6px", fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" };
const detailValueStyle = { display: "block", marginBottom: "12px" };
const primaryButtonStyle = { padding: "12px 16px", borderRadius: "14px", border: "none", background: "#0f172a", color: "white", cursor: "pointer", fontWeight: 700 };
const dangerButtonStyle = { padding: "12px 16px", borderRadius: "14px", border: "none", background: "#dc2626", color: "white", cursor: "pointer", fontWeight: 700 };
const metaGridStyle = { display: "grid", gridTemplateColumns: "1fr auto", gap: "10px 12px", color: "#334155", alignItems: "center" };

export default AdminUsersPage;