import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
  const fetchFaculty = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/faculty`);

      if (!response.ok) {
        throw new Error("Failed to fetch faculty");
      }

      const data = await response.json();
      setFaculty(data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  fetchFaculty();
}, []);
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    department: "",
    designation: "",
    email: "",
    status: "Active",
  });

  const filteredFaculty = faculty.filter((member) => {
    const query = search.toLowerCase();

    return (
      member.name.toLowerCase().includes(query) ||
      member.employeeId.toLowerCase().includes(query) ||
      member.department.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  });

  const openAddModal = () => {
    setEditingFaculty(null);

    setFormData({
      name: "",
      employeeId: "",
      department: "",
      designation: "",
      email: "",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingFaculty(member);

    setFormData({
      name: member.name,
      employeeId: member.employeeId,
      department: member.department,
      designation: member.designation,
      email: member.email,
      status: member.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFaculty(null);
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
    if (editingFaculty) {
      const response = await fetch(
        `${API_BASE_URL}/faculty/${editingFaculty._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update faculty");
      }

      const updatedFaculty = await response.json();

      setFaculty((previous) =>
        previous.map((member) =>
          member._id === editingFaculty._id ? updatedFaculty : member
        )
      );
    } else {
      const response = await fetch(`${API_BASE_URL}/faculty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create faculty");
      }

      const newFaculty = await response.json();

      setFaculty((previous) => [newFaculty, ...previous]);
    }

    closeModal();
  } catch (error) {
    console.error("Faculty save error:", error);
    alert(error.message);
  }
};
  const deleteFaculty = async (id) => {
  const member = faculty.find((item) => item._id === id);

  if (!member) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete ${member.name}?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/faculty/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete faculty");
    }

    setFaculty((previous) =>
      previous.filter((member) => member._id !== id)
    );
  } catch (error) {
    console.error("Faculty delete error:", error);
    alert(error.message);
  }
};

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Faculty"
        description="Manage faculty members and their academic information."
      />

      <div className="content-card">
        <div className="content-card-header admin-student-toolbar">
          <div>
            <h2>Faculty Directory</h2>
            <p>{filteredFaculty.length} faculty members found</p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Faculty
          </button>
        </div>

        <div className="admin-search-wrapper">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, ID, department or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table className="data-table admin-student-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Faculty</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredFaculty.map((member) => (
                <tr key={member._id}>
                  <td>{member.employeeId}</td>

                  <td>
                    <div className="admin-student-name">
                      <div className="admin-student-avatar">
                        {member.name.charAt(0)}
                      </div>

                      <span>{member.name}</span>
                    </div>
                  </td>

                  <td>{member.department}</td>
                  <td>{member.designation}</td>
                  <td>{member.email}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        member.status === "Active"
                          ? "status-present"
                          : "status-absent"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td>
                    <div className="admin-action-buttons">
                      <button
                        type="button"
                        className="admin-icon-button"
                        title="Edit faculty"
                        onClick={() => openEditModal(member)}
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        className="admin-icon-button admin-delete-button"
                        title="Delete faculty"
                        onClick={() => deleteFaculty(member._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFaculty.length === 0 && (
                <tr>
                  <td colSpan="7" className="admin-empty-state">
                    No faculty members found.
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
                <h2>
                  {editingFaculty ? "Edit Faculty" : "Add Faculty"}
                </h2>

                <p>
                  {editingFaculty
                    ? "Update faculty information."
                    : "Enter the faculty member's information."}
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
                  <label>Faculty Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter faculty name"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Employee ID</label>

                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="e.g. FAC006"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Department</label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Computer Science">
                      Computer Science
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Electronics">
                      Electronics
                    </option>
                    <option value="Mechanical">
                      Mechanical
                    </option>
                    <option value="Civil">
                      Civil
                    </option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Designation</label>

                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select designation</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">
                      Associate Professor
                    </option>
                    <option value="Assistant Professor">
                      Assistant Professor
                    </option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>

                <div className="admin-form-group admin-form-full">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="faculty@example.com"
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

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {editingFaculty ? "Update Faculty" : "Add Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Faculty;