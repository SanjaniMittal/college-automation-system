import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  CalendarDays,
  Bell,
  Clock,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import AttendanceChart from "../../components/AttendanceChart";
import NoticeCard from "../../components/NoticeCard";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

import "../../dashboard.css";
import "../../pages.css";
import "../../components.css";

function Dashboard() {
  const { user } = useAuth();
  const rollNo = user?.rollNo || "CSE001";

  const [stats, setStats] = useState({
    overallAttendance: "88.5%",
    enrolledCourses: 5,
    pendingAssignments: 3,
    totalSubmissions: 1,
    attendanceChart: [
      { label: "DSA", value: 88 },
      { label: "DBMS", value: 82 },
      { label: "CN", value: 92 },
      { label: "OS", value: 85 },
      { label: "SE", value: 90 },
    ],
  });

  const [notices, setNotices] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);

        const [statsRes, noticesRes, timetableRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stats/student/${rollNo}`),
          fetch(`${API_BASE_URL}/notices`),
          fetch(`${API_BASE_URL}/timetable?className=CSE-A`),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (noticesRes.ok) {
          const noticesData = await noticesRes.json();
          const published = noticesData.filter((n) => n.status === "Published");
          setNotices(published.slice(0, 3));
        }

        if (timetableRes.ok) {
          const timetableData = await timetableRes.json();
          setSchedule(timetableData.slice(0, 3));
        }
      } catch (err) {
        console.error("Error loading student dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [rollNo]);

  const fallbackSchedule = [
    { subject: "Data Structures", time: "09:00 AM - 10:00 AM" },
    { subject: "Database Management", time: "11:00 AM - 12:00 PM" },
    { subject: "Computer Networks", time: "02:00 PM - 03:00 PM" },
  ];

  const displaySchedule = schedule.length > 0 ? schedule : fallbackSchedule;

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome, ${user?.name || "Student"}`}
        description="Here is an overview of your academic performance, assignments, and schedule."
      />

      <div className="stats-grid">
        <StatCard
          title="Overall Attendance"
          value={stats.overallAttendance}
          icon={<ClipboardCheck size={21} />}
          description="Across all enrolled courses"
        />

        <StatCard
          title="Enrolled Courses"
          value={String(stats.enrolledCourses)}
          icon={<BookOpen size={21} />}
          description="Current semester 6"
        />

        <StatCard
          title="Pending Assignments"
          value={String(stats.pendingAssignments)}
          icon={<FileText size={21} />}
          description="Due this week"
        />

        <StatCard
          title="Today's Classes"
          value={String(displaySchedule.length)}
          icon={<CalendarDays size={21} />}
          description="Scheduled sessions"
        />
      </div>

      <div className="dashboard-row">
        <div className="dashboard-section-card">
          <AttendanceChart data={stats.attendanceChart} />
        </div>

        <div className="dashboard-section-card">
          <h2>Today's Schedule</h2>
          <p>Upcoming classes and laboratory sessions</p>

          <div className="activity-list">
            {displaySchedule.map((item, index) => (
              <div className="activity-item" key={index}>
                <div className="activity-dot"></div>

                <div>
                  <p>
                    <strong>{item.subject}</strong>
                  </p>

                  <span>
                    <Clock size={12} /> {item.time} {item.room ? `• ${item.room}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-section-card">
        <div className="content-card-header">
          <div>
            <h2>Latest Notices & Announcements</h2>
            <p>Official notices published by administration and faculty</p>
          </div>

          <Bell size={20} />
        </div>

        <div className="notice-list">
          {notices.map((notice) => (
            <NoticeCard
              key={notice._id || notice.title}
              title={notice.title}
              description={notice.content || `Notice for ${notice.audience}`}
              date={
                notice.date
                  ? new Date(notice.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recent"
              }
              type={notice.category || "General"}
            />
          ))}

          {notices.length === 0 && (
            <div className="admin-empty-state">No new announcements at this time.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;