import { useEffect, useState } from "react";
import { Check, X, CheckCheck, XCircle, Calendar, BookOpen, Users } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("Data Structures");
  const [selectedClass, setSelectedClass] = useState("CSE-A");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [attendance, setAttendance] = useState({});
  const [attendanceIds, setAttendanceIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchAttendanceForFilter();
  }, [selectedCourse, selectedClass, selectedDate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [studentsRes, coursesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/students`),
        fetch(`${API_BASE_URL}/courses`),
      ]);

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
        if (coursesData.length > 0 && !selectedCourse) {
          setSelectedCourse(coursesData[0].name);
        }
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceForFilter = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`);
      if (!response.ok) return;

      const allAttendance = await response.json();

      // Find records matching selected course and date
      const statusMap = {};
      const idMap = {};

      allAttendance.forEach((record) => {
        const recordDateStr = record.date ? record.date.split("T")[0] : "";
        if (record.course === selectedCourse && recordDateStr === selectedDate) {
          statusMap[record.rollNo] = record.status === "Present";
          idMap[record.rollNo] = record._id;
        }
      });

      setAttendance(statusMap);
      setAttendanceIds(idMap);
    } catch (error) {
      console.error("Error loading attendance records:", error);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (s.status === "Inactive") return false;
    if (selectedClass === "All") return true;
    return s.className === selectedClass;
  });

  const toggleAttendance = async (student) => {
    const isCurrentlyPresent = attendance[student.rollNo] ?? false;
    const newStatus = isCurrentlyPresent ? "Absent" : "Present";
    await saveAttendanceStatus(student, newStatus);
  };

  const markAll = async (newStatus) => {
    setSaving(true);
    for (const student of filteredStudents) {
      await saveAttendanceStatus(student, newStatus);
    }
    setSaving(false);
  };

  const saveAttendanceStatus = async (student, newStatus) => {
    try {
      const existingId = attendanceIds[student.rollNo];
      const payload = {
        studentName: student.name,
        rollNo: student.rollNo,
        course: selectedCourse,
        date: new Date(selectedDate).toISOString(),
        status: newStatus,
      };

      if (existingId) {
        const res = await fetch(`${API_BASE_URL}/attendance/${existingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update");
      } else {
        const res = await fetch(`${API_BASE_URL}/attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setAttendanceIds((prev) => ({ ...prev, [student.rollNo]: created._id }));
        }
      }

      setAttendance((prev) => ({
        ...prev,
        [student.rollNo]: newStatus === "Present",
      }));
    } catch (error) {
      console.error("Failed to save attendance:", error);
    }
  };

  const presentCount = filteredStudents.filter((s) => attendance[s.rollNo]).length;
  const absentCount = filteredStudents.length - presentCount;
  const attendancePercentage =
    filteredStudents.length > 0 ? Math.round((presentCount / filteredStudents.length) * 100) : 0;

  return (
    <DashboardLayout role="faculty">
      <PageHeader
        title="Class Attendance"
        description="Mark and manage real-time attendance across your courses and classes."
      />

      {/* Control Filters */}
      <div className="content-card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <BookOpen size={18} color="#6366f1" />
              <label style={{ fontWeight: 600, fontSize: "0.85rem" }}>Course:</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="login-input"
                style={{ width: "auto", minWidth: "180px", margin: 0, padding: "8px 12px" }}
              >
                {courses.length > 0 ? (
                  courses.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Database Management">Database Management</option>
                    <option value="Computer Networks">Computer Networks</option>
                  </>
                )}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Users size={18} color="#6366f1" />
              <label style={{ fontWeight: 600, fontSize: "0.85rem" }}>Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="login-input"
                style={{ width: "auto", margin: 0, padding: "8px 12px" }}
              >
                <option value="CSE-A">CSE-A</option>
                <option value="CSE-B">CSE-B</option>
                <option value="All">All Students</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={18} color="#6366f1" />
              <label style={{ fontWeight: 600, fontSize: "0.85rem" }}>Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="login-input"
                style={{ width: "auto", margin: 0, padding: "8px 12px" }}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="admin-primary-button"
              onClick={() => markAll("Present")}
              disabled={saving}
              style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}
            >
              <CheckCheck size={16} /> Mark All Present
            </button>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => markAll("Absent")}
              disabled={saving}
              style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}
            >
              <XCircle size={16} /> Mark All Absent
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <p>Total Students</p>
            <h3>{filteredStudents.length}</h3>
            <span>Enrolled in {selectedClass}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <p>Present</p>
            <h3>{presentCount}</h3>
            <span>Students present</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <p>Absent</p>
            <h3>{absentCount}</h3>
            <span>Students absent</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <p>Attendance Rate</p>
            <h3>{attendancePercentage}%</h3>
            <span>For selected session</span>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>
              {selectedCourse} — {selectedClass}
            </h2>
            <p>Session Date: {new Date(selectedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="admin-empty-state">No students found in {selectedClass}.</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => {
                  const isPresent = attendance[student.rollNo] ?? false;

                  return (
                    <tr key={student._id}>
                      <td>
                        <strong>{student.rollNo}</strong>
                      </td>

                      <td>
                        <div className="admin-student-name">
                          <div className="admin-student-avatar">
                            {student.name.charAt(0)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>

                      <td>{student.email}</td>

                      <td>
                        <span
                          className={`status-badge ${
                            isPresent ? "status-present" : "status-absent"
                          }`}
                        >
                          {isPresent ? "Present" : "Absent"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`attendance-button ${
                            isPresent ? "mark-absent" : "mark-present"
                          }`}
                          onClick={() => toggleAttendance(student)}
                          disabled={saving}
                        >
                          {isPresent ? (
                            <>
                              <X size={16} /> Mark Absent
                            </>
                          ) : (
                            <>
                              <Check size={16} /> Mark Present
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Attendance;