import { useState } from "react";
import { Bell, Menu, Search, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ role, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const activeRole = user?.role || role || "student";

  const roleNames = {
    admin: "Administrator",
    faculty: "Faculty",
    student: "Student",
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <button className="menu-button" onClick={onMenuClick} aria-label="Toggle Menu">
        <Menu size={22} />
      </button>

      <div className="navbar-search">
        <Search size={18} />
        <input type="text" placeholder="Search courses, notices, people..." />
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon" title="Notifications">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="navbar-profile-wrapper" style={{ position: "relative" }}>
          <div
            className="navbar-profile"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: "pointer" }}
            title="Account menu"
          >
            <div className="admin-student-avatar" style={{ width: 34, height: 34, fontSize: "0.9rem" }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={34} />}
            </div>

            <div>
              <strong>{user?.name || "Welcome"}</strong>
              <span>{roleNames[activeRole] || "Student"}</span>
            </div>
          </div>

          {showDropdown && (
            <div
              className="navbar-dropdown"
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                background: "var(--card-bg, #ffffff)",
                border: "1px solid var(--border-color, #e2e8f0)",
                borderRadius: "8px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                minWidth: "180px",
                padding: "8px 0",
                zIndex: 1000,
              }}
            >
              <div style={{ padding: "8px 16px", borderBottom: "1px solid #f1f5f9" }}>
                <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600 }}>{user?.name}</p>
                <small style={{ color: "#64748b", fontSize: "0.75rem" }}>{user?.email}</small>
              </div>

              {activeRole === "student" && (
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/student/profile");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "8px 16px",
                    background: "none",
                    border: "none",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "inherit",
                  }}
                >
                  <UserCircle size={16} /> My Profile
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "8px 16px",
                  background: "none",
                  border: "none",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  textAlign: "left",
                  color: "#ef4444",
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;