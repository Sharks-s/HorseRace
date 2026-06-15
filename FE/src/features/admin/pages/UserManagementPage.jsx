import React, { useState, useEffect } from "react";
import { adminUserApi } from "../../../api/adminUserApi";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [page, filterRole, filterStatus]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: page,
        size: 10,
        ...(filterRole && { role: filterRole }),
        ...(filterStatus && { status: filterStatus }),
      };
      const response = await adminUserApi.getUsers(params);
      if (response.success) {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditData({
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await adminUserApi.updateUser(selectedUser.id, editData);
      if (response.success) {
        setIsEditModalOpen(false);
        fetchUsers();
      }
    } catch (error) {
      alert("Error updating user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await adminUserApi.deleteUser(id);
        if (response.success) {
          fetchUsers();
        }
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background text-on-background antialiased">
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center px-6 h-16 z-10 shrink-0">
        <h1
          className="text-2xl font-bold tracking-tighter text-secondary"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          User Management
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
        <section className="bg-surface-container-lowest p-4 rounded-xl shadow border border-outline-variant/30 flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-on-surface-variant">
              Filter by Role
            </label>
            <select
              className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none text-on-surface"
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="HORSE_OWNER">Horse Owner</option>
              <option value="JOCKEY">Jockey</option>
              <option value="REFEREE">Referee</option>
              <option value="SPECTATOR">Spectator</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-on-surface-variant">
              Filter by Status
            </label>
            <select
              className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none text-on-surface"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="BANNED">Banned</option>
            </select>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl shadow border border-outline-variant/30 overflow-hidden overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-on-surface-variant">
              Loading users...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-on-surface-variant font-semibold text-sm border-b border-outline-variant/30">
                <tr>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-surface-container-lowest/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-on-surface text-sm">
                      {user.fullName}
                    </td>
                    <td className="py-3 px-4 text-sm text-on-surface-variant">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex font-medium text-xs px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex font-medium text-xs px-2 py-1 rounded-full ${
                          user.status === "ACTIVE"
                            ? "bg-[#004225] text-white"
                            : "bg-error-container text-on-error-container"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-primary text-on-primary font-semibold text-xs px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="border border-error text-error font-semibold text-xs px-3 py-1.5 rounded hover:bg-error-container transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-6 text-center text-on-surface-variant text-sm"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-4 border-t border-outline-variant/30">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-sm bg-surface-container rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm font-medium">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-sm bg-surface-container rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                <h2
                  className="text-xl font-bold tracking-tight text-on-surface"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  Edit User
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="material-symbols-outlined text-on-surface-variant hover:text-on-surface"
                >
                  close
                </button>
              </div>
              <form onSubmit={handleUpdateUser} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-on-surface">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    value={editData.fullName}
                    onChange={(e) =>
                      setEditData({ ...editData, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-on-surface">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    value={editData.phoneNumber}
                    onChange={(e) =>
                      setEditData({ ...editData, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-on-surface">
                    Role
                  </label>
                  <select
                    className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    value={editData.role}
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="HORSE_OWNER">Horse Owner</option>
                    <option value="JOCKEY">Jockey</option>
                    <option value="REFEREE">Referee</option>
                    <option value="SPECTATOR">Spectator</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-on-surface">
                    Status
                  </label>
                  <select
                    className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="BANNED">Banned</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-on-surface border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagementPage;
