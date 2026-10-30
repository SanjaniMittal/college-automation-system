import { useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

function Attendance() {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentRollNo = user?.rollNo || "CSE001";

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/attendance`);

        if (!response.ok) {
          throw new Error("Failed to fetch attendance");
        }

        const data = await response.json();

        const studentRecords = data.filter(
          (record) => record.rollNo === studentRollNo
        );

        setAttendanceRecords(studentRecords);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setError("Unable to load attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Calculate subject-wise attendance
  const subjectMap = {};

  attendanceRecords.forEach((record) => {
    const subject = record.course;

    if (!subjectMap[subject]) {
      subjectMap[subject] = {
        subject,
        total: 0,
        present: 0,
        absent: 0,
      };
    }

    subjectMap[subject].total += 1;

    if (record.status === "Present") {
      subjectMap[subject].present += 1;
    } else {
      subjectMap[subject].absent += 1;
    }
  });

  const attendanceData = Object.values(subjectMap).map((item) => {
    const percentage =
      item.total > 0
        ? ((item.present / item.total) * 100).toFixed(1)
        : "0.0";

    return {
      ...item,
      percentage: `${percentage}%`,
    };
  });

  const totalClasses = attendanceRecords.length;

  const classesAttended = attendanceRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const classesMissed = attendanceRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const overallAttendance =
    totalClasses > 0
      ? ((classesAttended / totalClasses) * 100).toFixed(1)
      : "0.0";

  const columns = [
    {
      key: "subject",
      label: "Subject",
    },
    {
      key: "total",
      label: "Total Classes",
    },
    {
      key: "present",
      label: "Present",
    },
    {
      key: "absent",
      label: "Absent",
    },
    {
      key: "percentage",
      label: "Attendance",
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="My Attendance"
        description="Track your attendance for all enrolled subjects."
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <ClipboardCheck size={21} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>Overall Attendance</p>
            <h3>{overallAttendance}%</h3>
            <span>Current semester</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <p>Total Classes</p>
            <h3>{totalClasses}</h3>
            <span>Conducted so far</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <p>Classes Attended</p>
            <h3>{classesAttended}</h3>
            <span>Present</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <p>Classes Missed</p>
            <h3>{classesMissed}</h3>
            <span>Absent</span>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Subject-wise Attendance</h2>
            <p>Your attendance record by subject</p>
          </div>
        </div>

        {loading && (
          <div className="admin-empty-state">
            Loading attendance...
          </div>
        )}

        {error && !loading && (
          <div className="admin-empty-state">
            {error}
          </div>
        )}

        {!loading && !error && (
          <DataTable
            columns={columns}
            data={attendanceData}
            emptyMessage="No attendance records found."
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Attendance;