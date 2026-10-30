import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  Clock,
  MapPin,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFacultyData = async () => {
      try {
        setLoading(true);

        const [coursesRes, assignmentsRes, timetableRes, studentsRes] =
          await Promise.all([
            fetch(`${API_BASE_URL}/courses`),
            fetch(`${API_BASE_URL}/assignments`),
            fetch(`${API_BASE_URL}/timetable`),
            fetch(`${API_BASE_URL}/students`),
          ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData);
        }

        if (assignmentsRes.ok) {
          const assignmentsData = await assignmentsRes.json();
          setAssignments(assignmentsData);
        }

        if (timetableRes.ok) {
          const timetableData = await timetableRes.json();
          setTimetable(timetableData);
        }

        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudentCount(studentsData.filter((s) => s.status !== "Inactive").length);
        }
      } catch (err) {
        console.error("Failed to load faculty dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFacultyData();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: studentCount || 6,
      description: "Across your enrolled classes",
      icon: Users,
    },
    {
      title: "My Courses",
      value: courses.length || 5,
      description: "Active courses this semester",
      icon: BookOpen,
    },
    {
      title: "Average Attendance",
      value: "92%",
      description: "Across recorded sessions",
      icon: ClipboardCheck,
    },
    {
      title: "Active Assignments",
      value: assignments.length || 4,
      description: "Published to students",
      icon: FileText,
    },
  ];

  // Pick classes for today (e.g. Monday/Tuesday or first 4 from timetable)
  const scheduledClasses =
    timetable.length > 0
      ? timetable.slice(0, 4)
      : [
          {
            subject: "Data Structures",
            className: "CSE-A",
            time: "09:00 AM - 10:00 AM",
            room: "Room 201",
          },
          {
            subject: "Database Management",
            className: "CSE-B",
            time: "11:00 AM - 12:00 PM",
            room: "Lab 102",
          },
          {
            subject: "Computer Networks",
            className: "CSE-A",
            time: "02:00 PM - 03:00 PM",
            room: "Room 305",
          },
        ];

  return (
    <DashboardLayout role="faculty">
      <PageHeader
        title={`Welcome, ${user?.name || "Professor"}`}
        description="Monitor student progress, track attendance, and manage assignments."
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
            <h2>Scheduled Classes</h2>
            <p>Your upcoming teaching sessions</p>
          </div>
        </div>

        <div className="faculty-class-list">
          {scheduledClasses.map((item, index) => (
            <div className="faculty-class-item" key={index}>
              <div className="faculty-class-icon">
                <BookOpen size={20} />
              </div>

              <div className="faculty-class-info">
                <h3>{item.subject}</h3>
                <p>{item.className} {item.day ? `• ${item.day}` : ""}</p>
              </div>

              <div className="faculty-class-details">
                <span>
                  <Clock size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                  {item.time}
                </span>
                <small>
                  <MapPin size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 2 }} />
                  {item.room}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;