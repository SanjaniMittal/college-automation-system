import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children, role }) {
  const { role: authRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeRole = role || authRole || "student";

  return (
    <div className="dashboard-layout">
      <Sidebar
        role={activeRole}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="dashboard-main">
        <Navbar
          role={activeRole}
          onMenuClick={() => setMobileOpen(!mobileOpen)}
        />

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;