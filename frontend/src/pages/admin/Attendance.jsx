import { useEffect, useMemo, useState } from "react";
import {
  ClipboardCheck,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Attendance() {
  const [selectedClass, setSelectedClass] = useState("CSE-A");
  const [selectedSubject, setSelectedSubject] =
    useState("Data Structures");

  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);

const [formData, setFormData] = useState({
  studentName: "",
  rollNo: "",
  course: "Data Structures",
  date: new Date().toISOString().split("T")[0],
  status: "Present",
});
const openAddModal = () => {
  setFormData({
    studentName: "",
    rollNo: "",
    course: selectedSubject,
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);
};

const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};
  useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`);

      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  fetchAttendance();
}, []);

  const filteredRecords = useMemo(() => {
  return records.filter(
    (record) => record.course === selectedSubject
  );
}, [records, selectedSubject]);

  const presentCount = filteredRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = filteredRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const attendancePercentage =
    filteredRecords.length > 0
      ? Math.round((presentCount / filteredRecords.length) * 100)
      : 0;

  const toggleAttendance = async (id) => {
  const record = records.find((item) => item._id === id);

  if (!record) return;

  const updatedStatus =
    record.status === "Present" ? "Absent" : "Present";

  try {
    const response = await fetch(
      `${API_BASE_URL}/attendance/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: updatedStatus,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to update attendance"
      );
    }

    const updatedRecord = await response.json();

    setRecords((previous) =>
      previous.map((item) =>
        item._id === id ? updatedRecord : item
      )
    );
  } catch (error) {
    console.error("Attendance update error:", error);
    alert(error.message);
  }
};
const deleteAttendance = async (id) => {
  const record = records.find((item) => item._id === id);

  if (!record) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete attendance for ${record.studentName}?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/attendance/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to delete attendance"
      );
    }

    setRecords((previous) =>
      previous.filter((item) => item._id !== id)
    );
  } catch (error) {
    console.error("Attendance delete error:", error);
    alert(error.message);
  }
};
  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Attendance Management"
        description="Monitor and manage attendance across classes and subjects."
      />

      <div className="content-card">
        <div className="content-card-header">
  <div>
    <h2>Attendance Filters</h2>
    <p>Select a class and subject to view attendance.</p>
  </div>

  <button
  type="button"
  className="primary-button"
  onClick={openAddModal}
>
  + Add Attendance
</button>
</div>

        <div className="admin-attendance-filter">
          <select
            value={selectedClass}
            onChange={(event) =>
              setSelectedClass(event.target.value)
            }
          >
            <option value="CSE-A">CSE-A</option>
            <option value="CSE-B">CSE-B</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(event) =>
              setSelectedSubject(event.target.value)
            }
          >
            <option value="Data Structures">
              Data Structures
            </option>
            <option value="Database Management">
              Database Management
            </option>
            <option value="Computer Networks">
              Computer Networks
            </option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <Users size={21} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>Total Students</p>
            <h3>{filteredRecords.length}</h3>
            <span>Students in selected class</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <CheckCircle size={21} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>Present</p>
            <h3>{presentCount}</h3>
            <span>Students present</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <XCircle size={21} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>Absent</p>
            <h3>{absentCount}</h3>
            <span>Students absent</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <ClipboardCheck size={21} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>Attendance Rate</p>
            <h3>{attendancePercentage}%</h3>
            <span>Selected class average</span>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Attendance Records</h2>
            <p>
              {selectedSubject} — {selectedClass}
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table admin-attendance-table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record._id}>
                  <td>{record.rollNo}</td>

                  <td>{record.studentName}</td>

                  <td>{record.course}</td>

                  <td>{record.date}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        record.status === "Present"
                          ? "status-present"
                          : "status-absent"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td>
  <div style={{ display: "flex", gap: "8px" }}>
    <button
      type="button"
      className={`attendance-button ${
        record.status === "Present"
          ? "mark-absent"
          : "mark-present"
      }`}
      onClick={() =>
        toggleAttendance(record._id)
      }
    >
      {record.status === "Present"
        ? "Mark Absent"
        : "Mark Present"}
    </button>

    <button
      type="button"
      className="attendance-button mark-absent"
      onClick={() =>
        deleteAttendance(record._id)
      }
    >
      Delete
    </button>
  </div>
</td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="admin-empty-state"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
  <div className="admin-modal-overlay">
    <div className="admin-modal">
      <div className="admin-modal-header">
        <div>
          <h2>Add Attendance</h2>
          <p>Create a new attendance record.</p>
        </div>

        <button
          type="button"
          className="admin-modal-close"
          onClick={closeModal}
        >
          ×
        </button>
      </div>

      <form
  onSubmit={async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to create attendance"
        );
      }

      const newRecord = await response.json();

      setRecords((previous) => [newRecord, ...previous]);

      closeModal();
    } catch (error) {
      console.error("Attendance save error:", error);
      alert(error.message);
    }
  }}
>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student name"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Roll No.</label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              placeholder="Enter roll number"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Course</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="Data Structures">
                Data Structures
              </option>
              <option value="Database Management">
                Database Management
              </option>
              <option value="Computer Networks">
                Computer Networks
              </option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        <div className="admin-modal-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            Add Attendance
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </DashboardLayout>
  );
}

export default Attendance;