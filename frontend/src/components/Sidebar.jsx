import {
  LayoutDashboard,
  Users,
  UserRound,
  BookOpen,
  ClipboardCheck,
  FileText,
  Megaphone,
  CalendarDays,
  UserCircle,
  X,
  Bell,
  KeyRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Sidebar({ role = "student", mobileOpen = false, onClose }) {
  const navigate = useNavigate();

  const menuItems = {
    admin: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
      {
        label: "User Accounts",
        icon: KeyRound,
        path: "/admin/users",
      },
      {
        label: "Students",
        icon: Users,
        path: "/admin/students",
      },
      {
        label: "Faculty",
        icon: UserRound,
        path: "/admin/faculty",
      },
      {
        label: "Courses",
        icon: BookOpen,
        path: "/admin/courses",
      },
      {
        label: "Attendance",
        icon: ClipboardCheck,
        path: "/admin/attendance",
      },
      {
        label: "Notices",
        icon: Megaphone,
        path: "/admin/notices",
      },
    ],

    faculty: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/faculty/dashboard",
      },
      {
        label: "My Classes",
        icon: BookOpen,
        path: "/faculty/classes",
      },
      {
        label: "Attendance",
        icon: ClipboardCheck,
        path: "/faculty/attendance",
      },
      {
        label: "Assignments",
        icon: FileText,
        path: "/faculty/assignments",
      },
      {
  label: "Notices",
  icon: Bell,
  path: "/faculty/notices",
},
    ],

    student: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/student/dashboard",
      },
      {
        label: "My Attendance",
        icon: ClipboardCheck,
        path: "/student/attendance",
      },
      {
        label: "Assignments",
        icon: FileText,
        path: "/student/assignments",
      },
      {
        label: "Timetable",
        icon: CalendarDays,
        path: "/student/timetable",
      },
      {
        label: "Notices",
        icon: Megaphone,
        path: "/student/notices",
      },
      {
        label: "Profile",
        icon: UserCircle,
        path: "/student/profile",
      },
    ],
  };

  const items = menuItems[role] || menuItems.student;

  const handleNavigation = (path) => {
    navigate(path);

    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <BookOpen size={22} />
        </div>

        <div>
          <h2>Acadexa</h2>
          <span>College Management</span>
        </div>

        {onClose && (
          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className="sidebar-item"
              onClick={() => handleNavigation(item.path)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span>Acadexa</span>
        <small>© 2026</small>
      </div>
    </aside>
  );
}

export default Sidebar;