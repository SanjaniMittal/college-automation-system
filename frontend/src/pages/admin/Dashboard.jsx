import { useEffect, useState } from "react";
import {
  Users,
  UserRound,
  BookOpen,
  ClipboardCheck,
  Megaphone,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Dashboard() {
  const [statsData, setStatsData] = useState({
    totalStudents: 6,
    totalFaculty: 4,
    totalCourses: 5,
    attendancePercentage: "89%",
    recentNotices: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats/admin`);
        if (response.ok) {
          const data = await response.json();
          setStatsData(data);
        }
      } catch (error) {
        console.warn("Could not fetch real-time stats, using baseline:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: statsData.totalStudents,
      description: "Enrolled in active programs",
      icon: Users,
    },
    {
      title: "Total Faculty",
      value: statsData.totalFaculty,
      description: "Active academic staff",
      icon: UserRound,
    },
    {
      title: "Total Courses",
      value: statsData.totalCourses,
      description: "Offered this semester",
      icon: BookOpen,
    },
    {
      title: "Overall Attendance",
      value: statsData.attendancePercentage,
      description: "College-wide average",
      icon: ClipboardCheck,
    },
  ];

  const recentNotices = statsData.recentNotices?.length > 0
    ? statsData.recentNotices.map((n) => ({
        title: n.title,
        description: n.content || `Notice for ${n.audience}`,
        time: n.date
          ? new Date(n.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })
          : "Recently",
      }))
    : [
        {
          title: "Mid-Semester Examination Schedule Announced",
          description: "Published for all 6th semester students",
          time: "Today",
        },
        {
          title: "Annual Tech Fest 'Innovate 2026' Registrations",
          description: "Registrations opened for hackathons and paper presentations",
          time: "Yesterday",
        },
        {
          title: "Guest Lecture on Generative AI and LLMs",
          description: "Department of Computer Science auditorium event",
          time: "2 days ago",
        },
      ];

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Admin Dashboard"
        description="Comprehensive overview and management of students, faculty, courses, attendance, and announcements."
      />

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <div className="stat-card-icon">
                  <Icon size={21} />
                </div>
              </div>

              <div className="stat-card-content">
                <p>{stat.title}</p>
                <h3>{loading ? "..." : stat.value}</h3>
                <span>{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Latest Announcements & Activity</h2>
            <p>Real-time updates across the college portal</p>
          </div>
        </div>

        <div className="admin-activity-list">
          {recentNotices.map((activity, index) => (
            <div className="admin-activity-item" key={index}>
              <div className="admin-activity-icon">
                <Megaphone size={19} />
              </div>

              <div className="admin-activity-info">
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </div>

              <span className="admin-activity-time">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;