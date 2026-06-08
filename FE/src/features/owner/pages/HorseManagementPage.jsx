import { useCallback, useEffect, useState } from "react";
import { api } from "../../../api/axios";
import { toast } from "../../../shared/components/Toast";

const horseStatusOptions = ["", "PENDING_REVIEW", "APPROVED", "REJECTED", "REGISTERED"];

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("vi-VN") : "-");

const badgeStyle = (status) => {
  const palette = {
    PENDING_REVIEW: { background: "#fef3c7", color: "#92400e" },
    APPROVED: { background: "#dcfce7", color: "#166534" },
    REJECTED: { background: "#fee2e2", color: "#991b1b" },
    REGISTERED: { background: "#e0e7ff", color: "#3730a3" },
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

const initialForm = {
  name: "",
  breed: "",
  age: "",
  weight: "",
  healthCertExpiry: "",
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
      toast.error(error.response?.data?.message || error.response?.data || "Không tải được danh sách ngựa.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadHorses();
    }, 0);

    return () => window.clearTimeout(timer);
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
        toast.success("Cập nhật hồ sơ ngựa thành công");
      } else {
        await api.post("/owner/horses", payload);
        toast.success("Đã tạo hồ sơ ngựa và gửi duyệt");
      }
      resetForm();
      await loadHorses();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || "Không thể lưu hồ sơ ngựa.");
    }
  };

  const startEdit = (horse) => {
    if (horse.status === "REGISTERED") {
      toast.error("Không thể chỉnh sửa ngựa đã tham gia đua.");
      return;
    }

    setEditingHorseId(horse.id);
    setForm({
      name: horse.name,
      breed: horse.breed,
      age: horse.age,
      weight: horse.weight,
      healthCertExpiry: horse.healthCertExpiry,
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(0,148,136,0.08), transparent 25%), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)", color: "#0f172a" }}>
      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "32px 20px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
          <div>
            <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.18em", color: "#64748b", fontSize: "12px" }}>Horse Owner Portal</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "34px", lineHeight: 1.1 }}>Quản lý hồ sơ ngựa</h1>
            <p style={{ margin: "8px 0 0", color: "#475569" }}>Tạo mới, lọc theo trạng thái và cập nhật hồ sơ trước khi ngựa tham gia đua.</p>
          </div>
          <div style={summaryCardStyle}>
            <span style={summaryLabelStyle}>Tổng hồ sơ</span>
            <strong style={summaryValueStyle}>{horses.length}</strong>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)", gap: "20px", alignItems: "start" }}>
          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <h2 style={panelTitleStyle}>{editingHorseId ? "Cập nhật hồ sơ ngựa" : "Thêm hồ sơ ngựa"}</h2>
                <p style={panelSubtitleStyle}>BR-01: healthCertExpiry phải trong vòng 6 tháng, weight &gt; 0.</p>
              </div>
            </div>

            <form onSubmit={submitHorse} style={{ display: "grid", gap: "12px" }}>
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Tên ngựa" style={inputStyle} required />
              <input value={form.breed} onChange={(e) => setForm((prev) => ({ ...prev, breed: e.target.value }))} placeholder="Giống ngựa" style={inputStyle} required />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                <input type="number" min="1" value={form.age} onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))} placeholder="Tuổi" style={inputStyle} required />
                <input type="number" min="0.1" step="0.1" value={form.weight} onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))} placeholder="Cân nặng" style={inputStyle} required />
              </div>
              <input type="date" value={form.healthCertExpiry} onChange={(e) => setForm((prev) => ({ ...prev, healthCertExpiry: e.target.value }))} style={inputStyle} required />

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button type="submit" style={primaryButtonStyle}>{editingHorseId ? "Cập nhật" : "Tạo hồ sơ"}</button>
                {editingHorseId && <button type="button" onClick={resetForm} style={secondaryButtonStyle}>Hủy chỉnh sửa</button>}
              </div>
            </form>

            <div style={{ marginTop: "18px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
                <option value="">Tất cả trạng thái</option>
                {horseStatusOptions.filter(Boolean).map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button onClick={() => setStatusFilter("")} style={ghostButtonStyle}>Xóa bộ lọc</button>
            </div>
          </section>

          <section style={panelStyle}>
            <div style={panelHeaderStyle}>
              <div>
                <h2 style={panelTitleStyle}>Danh sách ngựa của tôi</h2>
                <p style={panelSubtitleStyle}>{loading ? "Đang tải dữ liệu..." : `${horses.length} hồ sơ`}</p>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    <th style={thStyle}>Tên</th>
                    <th style={thStyle}>Giống</th>
                    <th style={thStyle}>Tuổi</th>
                    <th style={thStyle}>Cân nặng</th>
                    <th style={thStyle}>Hết hạn HC</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {horses.map((horse) => (
                    <tr key={horse.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                      <td style={tdStyle}><strong>{horse.name}</strong></td>
                      <td style={tdStyle}>{horse.breed}</td>
                      <td style={tdStyle}>{horse.age}</td>
                      <td style={tdStyle}>{horse.weight}</td>
                      <td style={tdStyle}>{formatDate(horse.healthCertExpiry)}</td>
                      <td style={tdStyle}><span style={badgeStyle(horse.status)}>{horse.status}</span></td>
                      <td style={tdStyle}>
                        <button onClick={() => startEdit(horse)} style={actionButtonStyle}>Sửa</button>
                      </td>
                    </tr>
                  ))}
                  {!loading && horses.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>Chưa có ngựa nào trong danh sách.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const summaryCardStyle = { background: "white", borderRadius: "18px", padding: "14px 18px", border: "1px solid rgba(148,163,184,0.2)", boxShadow: "0 10px 30px rgba(15,23,42,0.06)" };
const summaryLabelStyle = { display: "block", color: "#64748b", fontSize: "12px", marginBottom: "6px" };
const summaryValueStyle = { fontSize: "24px", lineHeight: 1, color: "#0f172a" };
const panelStyle = { background: "rgba(255,255,255,0.94)", borderRadius: "24px", border: "1px solid rgba(148,163,184,0.18)", padding: "20px", boxShadow: "0 12px 30px rgba(15,23,42,0.07)" };
const panelHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" };
const panelTitleStyle = { margin: 0, fontSize: "22px" };
const panelSubtitleStyle = { margin: "6px 0 0", color: "#64748b" };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", boxSizing: "border-box" };
const selectStyle = { padding: "12px 14px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", minWidth: "180px" };
const ghostButtonStyle = { padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer", fontWeight: 700 };
const primaryButtonStyle = { padding: "12px 16px", borderRadius: "14px", border: "none", background: "#0f172a", color: "white", cursor: "pointer", fontWeight: 700 };
const secondaryButtonStyle = { padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#0f172a", cursor: "pointer", fontWeight: 700 };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { padding: "14px 12px", whiteSpace: "nowrap" };
const tdStyle = { padding: "14px 12px", verticalAlign: "middle" };
const actionButtonStyle = { padding: "8px 12px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", fontWeight: 700 };

export default HorseManagementPage;