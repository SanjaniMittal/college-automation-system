import { useEffect, useState } from "react";
import {
  Search,
  KeyRound,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import authService from "../../services/authService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load user credentials directory:", error);
      setActionMessage({ text: "Failed to load user accounts", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";
    try {
      await authService.updateUserStatus(user._id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, status: nextStatus } : u))
      );
      setActionMessage({
        text: `Status for ${user.name} changed to ${nextStatus}`,
        type: "success",
      });
      setTimeout(() => setActionMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      setActionMessage({ text: error.message || "Failed to update user status", type: "error" });
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to remove ${user.name} (${user.email})?`)) {
      return;
    }

    try {
      await authService.deleteUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setActionMessage({
        text: `User account for ${user.name} deleted successfully.`,
        type: "success",
      });
      setTimeout(() => setActionMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      setActionMessage({ text: error.message || "Failed to delete user", type: "error" });
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.rollNo?.toLowerCase().includes(query) ||
      u.employeeId?.toLowerCase().includes(query) ||
      u.department?.toLowerCase().includes(query);

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <span className="status-badge status-present">🛡️ Admin</span>;
      case "faculty":
        return <span className="status-badge" style={{ background: "#e0e7ff", color: "#4338ca" }}>👨‍🏫 Faculty</span>;
      default:
        return <span className="status-badge" style={{ background: "#fef3c7", color: "#b45309" }}>🎓 Student</span>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="User Credentials & Accounts"
        description="View, verify, and manage all self-registered and pre-configured student, faculty, and administrative accounts."
      />

      {actionMessage.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "18px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: actionMessage.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${actionMessage.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            color: actionMessage.type === "success" ? "#166534" : "#991b1b",
          }}
        >
          {actionMessage.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <KeyRound size={21} />
            </div>
          </div>
          <div className="stat-card-content">
            <p>Total Registered Accounts</p>
            <h3>{users.length}</h3>
            <span>Stored in MongoDB</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon" style={{ background: "#dcfce7", color: "#166534" }}>
              <UserCheck size={21} />
            </div>
          </div>
          <div className="stat-card-content">
            <p>Active Users</p>
            <h3>{users.filter((u) => u.status === "Active").length}</h3>
            <span>Can sign in immediately</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon" style={{ background: "#fee2e2", color: "#991b1b" }}>
              <UserX size={21} />
            </div>
          </div>
          <div className="stat-card-content">
            <p>Deactivated / Inactive</p>
            <h3>{users.filter((u) => u.status === "Inactive").length}</h3>
            <span>Sign in blocked</span>
          </div>
        </div>
      </div>

      <div className="content-card">
        {/* Filters and Search Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <div className="table-search" style={{ flex: "1 1 280px" }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email, roll number, or employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Filter size={16} color="var(--text-secondary)" />
              <select
                className="filter-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            <button
              type="button"
              onClick={fetchUsers}
              className="btn btn-secondary"
              style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px" }}
              title="Refresh credentials"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* User Accounts Table */}
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            Loading stored user credentials...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            No user accounts found matching your query.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Role</th>
                  <th>Identifier</th>
                  <th>Department / Class</th>
                  <th>Registered On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong style={{ color: "var(--text-primary)" }}>{user.name}</strong>
                        <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      {user.role === "student" ? (
                        <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                          {user.rollNo || "—"}
                        </span>
                      ) : user.role === "faculty" ? (
                        <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                          {user.employeeId || "—"}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-secondary)" }}>System Admin</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: "13px" }}>
                        {user.department || "—"}
                        {user.className ? ` • Section ${user.className}` : ""}
                      </div>
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Initial Setup"}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.status === "Active" ? "status-present" : "status-absent"
                        }`}
                      >
                        {user.status || "Active"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="action-btn"
                          title={
                            user.status === "Active"
                              ? "Deactivate user login"
                              : "Activate user login"
                          }
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.status === "Active" ? (
                            <UserX size={16} color="#dc2626" />
                          ) : (
                            <UserCheck size={16} color="#16a34a" />
                          )}
                        </button>

                        {user.role !== "admin" && (
                          <button
                            type="button"
                            className="action-btn delete-btn"
                            title="Delete user credentials"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminUsers;
