import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, X, BookOpen } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Courses() {
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  fetchCourses();
}, []);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "",
    semester: "",
    faculty: "",
    credits: "",
  });

  const filteredCourses = courses.filter((course) => {
    const query = search.toLowerCase();

    return (
      course.code.toLowerCase().includes(query) ||
      course.name.toLowerCase().includes(query) ||
      course.department.toLowerCase().includes(query) ||
      course.faculty.toLowerCase().includes(query)
    );
  });

  const openAddModal = () => {
    setEditingCourse(null);

    setFormData({
      code: "",
      name: "",
      department: "",
      semester: "",
      faculty: "",
      credits: "",
    });

    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);

    setFormData({
      code: course.code,
      name: course.name,
      department: course.department,
      semester: course.semester,
      faculty: course.faculty,
      credits: course.credits,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
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

  const courseData = {
    ...formData,
    semester: Number(formData.semester),
    credits: Number(formData.credits),
  };

  try {
    if (editingCourse) {
      const response = await fetch(
        `${API_BASE_URL}/courses/${editingCourse._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update course");
      }

      const updatedCourse = await response.json();

      setCourses((previous) =>
        previous.map((course) =>
          course._id === editingCourse._id ? updatedCourse : course
        )
      );
    } else {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create course");
      }

      const newCourse = await response.json();

      setCourses((previous) => [newCourse, ...previous]);
    }

    closeModal();
  } catch (error) {
    console.error("Course save error:", error);
    alert(error.message);
  }
};
  const deleteCourse = async (id) => {
    const course = courses.find((item) => item._id === id);
    if (!course) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${course.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses((previous) =>
        previous.filter((course) => course._id !== id)
      );
    } catch (error) {
      console.error("Course delete error:", error);
      alert(error.message);
    }
  };

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Courses"
        description="Manage courses, subjects and faculty assignments."
      />

      <div className="content-card">
        <div className="content-card-header admin-student-toolbar">
          <div>
            <h2>Course Directory</h2>
            <p>{filteredCourses.length} courses found</p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Course
          </button>
        </div>

        <div className="admin-search-wrapper">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by course code, name or faculty..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table className="data-table admin-course-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Faculty</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course._id}>
                  <td>
                    <strong>{course.code}</strong>
                  </td>

                  <td>
                    <div className="admin-course-name">
                      <div className="admin-course-icon">
                        <BookOpen size={17} />
                      </div>

                      <span>{course.name}</span>
                    </div>
                  </td>

                  <td>{course.department}</td>
                  <td>{course.semester}</td>
                  <td>{course.faculty}</td>
                  <td>{course.credits}</td>

                  <td>
                    <div className="admin-action-buttons">
                      <button
                        type="button"
                        className="admin-icon-button"
                        title="Edit course"
                        onClick={() => openEditModal(course)}
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        className="admin-icon-button admin-delete-button"
                        title="Delete course"
                        onClick={() => deleteCourse(course._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="7" className="admin-empty-state">
                    No courses found.
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
                  {editingCourse ? "Edit Course" : "Add Course"}
                </h2>

                <p>
                  {editingCourse
                    ? "Update course information."
                    : "Enter the course information."}
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
                  <label>Course Code</label>

                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g. BCS506"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Course Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter course name"
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
                    <option value="Civil">Civil</option>
                  </select>
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

                <div className="admin-form-group">
                  <label>Faculty</label>

                  <input
                    type="text"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Neha Kapoor"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Credits</label>

                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    placeholder="e.g. 4"
                    required
                  />
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
                  {editingCourse ? "Update Course" : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Courses;