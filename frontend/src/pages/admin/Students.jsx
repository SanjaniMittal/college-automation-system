import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Students() {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    course: "",
    semester: 6,
    email: "",
    status: "Active",
  });
useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  fetchStudents();
}, []);
  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(query) ||
      student.rollNo.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  });

  const openAddModal = () => {
    setEditingStudent(null);

    setFormData({
      name: "",
      rollNo: "",
      course: "",
      semester: 6,
      email: "",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);

    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      course: student.course,
      semester: student.semester,
      email: student.email,
      status: student.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    if (editingStudent) {
      const response = await fetch(
        `${API_BASE_URL}/students/${editingStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            semester: Number(formData.semester),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      const updatedStudent = await response.json();

      setStudents((previous) =>
        previous.map((student) =>
          student._id === editingStudent._id ? updatedStudent : student
        )
      );
    } else {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          semester: Number(formData.semester),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create student");
      }

      const newStudent = await response.json();

      setStudents((previous) => [newStudent, ...previous]);
    }

    closeModal();
  } catch (error) {
    console.error("Student save error:", error);
    alert(error.message);
  }
};

  const deleteStudent = async (id) => {
  const student = students.find((item) => item._id === id);

  if (!student) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete ${student.name}?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/students/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete student");
    }

    setStudents((previous) =>
      previous.filter((student) => student._id !== id)
    );
  } catch (error) {
    console.error("Student delete error:", error);
    alert(error.message);
  }
};
  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Students"
        description="Manage student records and enrollment information."
      />

      <div className="content-card">
        <div className="content-card-header admin-student-toolbar">
          <div>
            <h2>Student Directory</h2>
            <p>{filteredStudents.length} students found</p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Student
          </button>
        </div>

        <div className="admin-search-wrapper">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, roll number or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table className="data-table admin-student-table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Student</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.rollNo}</td>

                  <td>
                    <div className="admin-student-name">
                      <div className="admin-student-avatar">
                        {student.name.charAt(0)}
                      </div>

                      <span>{student.name}</span>
                    </div>
                  </td>

                  <td>{student.course}</td>
                  <td>{student.semester}</td>
                  <td>{student.email}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        student.status === "Active"
                          ? "status-present"
                          : "status-absent"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td>
                    <div className="admin-action-buttons">
                      <button
                        type="button"
                        className="admin-icon-button"
                        title="Edit student"
                        onClick={() => openEditModal(student)}
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        className="admin-icon-button admin-delete-button"
                        title="Delete student"
                        onClick={() => deleteStudent(student._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="7" className="admin-empty-state">
                    No students found.
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
                <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
                <p>
                  {editingStudent
                    ? "Update student information."
                    : "Enter the student's information."}
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Student Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Roll Number</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="e.g. CSE006"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Course</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech CSE"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select semester</option>
                    <option value="1">1st</option>
                    <option value="2">2nd</option>
                    <option value="3">3rd</option>
                    <option value="4">4th</option>
                    <option value="5">5th</option>
                    <option value="6">6th</option>
                    <option value="7">7th</option>
                    <option value="8">8th</option>
                  </select>
                </div>

                <div className="admin-form-group admin-form-full">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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

                <button type="submit" className="admin-primary-button">
                  {editingStudent ? "Update Student" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Students;