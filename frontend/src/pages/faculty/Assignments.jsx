import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  CalendarDays,
  Plus,
  X,
  Eye,
  CheckCircle,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissionCounts, setSubmissionCounts] =
    useState({});
  const [studentCounts, setStudentCounts] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] =
    useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);
  const [gradeMarks, setGradeMarks] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");
  const [gradingLoading, setGradingLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    className: "",
    dueDate: "",
    description: "",
    createdBy: "",
  });

  // -----------------------------------
  // FETCH ASSIGNMENTS
  // -----------------------------------

  const fetchAssignments = async () => {
    const response = await fetch(`${API_BASE_URL}/assignments`);

    if (!response.ok) {
      throw new Error("Failed to fetch assignments");
    }

    const data = await response.json();

    setAssignments(data);
  };

  // -----------------------------------
  // FETCH SUBMISSIONS
  // -----------------------------------

  const fetchSubmissionCounts = async () => {
    const response = await fetch(`${API_BASE_URL}/submissions`);

    if (!response.ok) {
      throw new Error("Failed to fetch submissions");
    }

    const submissionsData = await response.json();

    const counts = {};

    submissionsData.forEach((submission) => {
      const assignmentId =
        submission.assignmentId?._id ||
        submission.assignmentId;

      if (!assignmentId) return;

      counts[assignmentId] =
        (counts[assignmentId] || 0) + 1;
    });

    setSubmissionCounts(counts);
  };

  // -----------------------------------
  // FETCH STUDENTS
  // -----------------------------------

  const fetchStudentCounts = async () => {
    const response = await fetch(`${API_BASE_URL}/students`);

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    const students = await response.json();

    const counts = {};

    students
      .filter((student) => student.status !== "Inactive")
      .forEach((student) => {
        if (!student.className) return;

        counts[student.className] =
          (counts[student.className] || 0) + 1;
      });

    setStudentCounts(counts);
  };

  // -----------------------------------
  // LOAD EVERYTHING
  // -----------------------------------

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchAssignments(),
        fetchSubmissionCounts(),
        fetchStudentCounts(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);

      setError("Unable to load assignment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -----------------------------------
  // CREATE ASSIGNMENT
  // -----------------------------------

  const openCreateModal = () => {
    setFormData({
      title: "",
      subject: "",
      className: "",
      dueDate: "",
      description: "",
      createdBy: "",
    });

    setShowModal(true);
  };

  const closeCreateModal = () => {
    setShowModal(false);
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
      const response = await fetch(`${API_BASE_URL}/assignments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create assignment"
        );
      }

      setAssignments((previous) => [
        ...previous,
        data,
      ]);

      setSubmissionCounts((previous) => ({
        ...previous,
        [data._id]: 0,
      }));

      closeCreateModal();
    } catch (error) {
      console.error(
        "Error creating assignment:",
        error
      );

      alert(error.message);
    }
  };

  // -----------------------------------
  // VIEW SUBMISSIONS
  // -----------------------------------

  const viewSubmissions = async (assignment) => {
    try {
      setSelectedAssignment(assignment);
      setSubmissions([]);
      setSubmissionsLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/submissions/assignment/${assignment._id}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch submissions"
        );
      }

      const data = await response.json();

      setSubmissions(data);
    } catch (error) {
      console.error(
        "Error fetching submissions:",
        error
      );

      alert("Unable to load submissions.");
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const closeSubmissions = () => {
    setSelectedAssignment(null);
    setSubmissions([]);
  };
const closeSubmissionDetails = () => {
  setSelectedSubmission(null);
};

const openSubmissionDetails = (submission) => {
  setSelectedSubmission(submission);
  setGradeMarks(
    submission.marks !== null && submission.marks !== undefined
      ? String(submission.marks)
      : ""
  );
  setGradeFeedback(submission.feedback || "");
};

const handleSaveGrade = async (e) => {
  e.preventDefault();
  if (!selectedSubmission) return;
  try {
    setGradingLoading(true);
    const res = await fetch(
      `${API_BASE_URL}/submissions/${selectedSubmission._id}/grade`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marks: gradeMarks,
          feedback: gradeFeedback,
        }),
      }
    );
    if (!res.ok) throw new Error("Failed to save grade");
    const updated = await res.json();
    setSubmissions((prev) =>
      prev.map((s) => (s._id === updated._id ? updated : s))
    );
    setSelectedSubmission(updated);
    alert("Grade and feedback saved successfully!");
  } catch (err) {
    alert(err.message);
  } finally {
    setGradingLoading(false);
  }
};

const deleteAssignment = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this assignment?"
  );
  if (!confirmed) return;
  try {
    const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete assignment");
    setAssignments((prev) => prev.filter((a) => a._id !== id));
  } catch (err) {
    alert(err.message);
  }
};
  // -----------------------------------
  // DATE FORMAT
  // -----------------------------------

  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatSubmittedDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // -----------------------------------
  // UI
  // -----------------------------------

  return (
    <DashboardLayout role="faculty">
      <PageHeader
        title="Assignments"
        description="Create and manage assignments for your classes."
        action={openCreateModal}
        actionLabel="Create Assignment"
      />

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Active Assignments</h2>

            <p>
              Track assignment submissions from your
              students.
            </p>
          </div>
        </div>

        {loading && (
          <div className="admin-empty-state">
            Loading assignments...
          </div>
        )}

        {error && !loading && (
          <div className="admin-empty-state">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          assignments.length === 0 && (
            <div className="admin-empty-state">
              No assignments available.
            </div>
          )}

        {!loading &&
          !error &&
          assignments.length > 0 && (
            <div className="assignment-list">
              {assignments.map((assignment) => {
                const submitted =
                  submissionCounts[
                    assignment._id
                  ] || 0;

                /*
                  Actual number of active students
                  in this class.
                */

                const totalStudents =
                  studentCounts[
                    assignment.className
                  ] || 0;

                return (
                  <div
                    className="assignment-item"
                    key={assignment._id}
                  >
                    <div className="assignment-icon">
                      <FileText size={21} />
                    </div>

                    <div className="assignment-info">
                      <h3>
                        {assignment.title}
                      </h3>

                      <p>
                        {assignment.subject} •{" "}
                        {assignment.className}
                      </p>
                    </div>

                    <div className="assignment-meta">
                      <span>
                        <CalendarDays size={16} />

                        Due:{" "}
                        {formatDate(
                          assignment.dueDate
                        )}
                      </span>

                      <span>
                        <Users size={16} />

                        {submitted}/
                        {totalStudents} submitted
                      </span>

                      <button
                        type="button"
                        className="page-header-action"
                        onClick={() =>
                          viewSubmissions(
                            assignment
                          )
                        }
                      >
                        <Eye size={16} />

                        View Submissions
                      </button>

                      <button
                        type="button"
                        className="admin-icon-button admin-delete-button"
                        title="Delete Assignment"
                        onClick={() =>
                          deleteAssignment(assignment._id)
                        }
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>

      {/* CREATE ASSIGNMENT MODAL */}

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <h2>Create Assignment</h2>

                <p>
                  Create a new assignment for your
                  students.
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeCreateModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-full">
                  <label>
                    Assignment Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter assignment title"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Subject</label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Data Structures"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Class</label>

                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    placeholder="e.g. CSE-A"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Due Date</label>

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Created By</label>

                  <input
                    type="text"
                    name="createdBy"
                    value={formData.createdBy}
                    onChange={handleChange}
                    placeholder="Faculty name"
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter assignment instructions..."
                    rows="4"
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  <Plus size={17} />

                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW SUBMISSIONS MODAL */}

      {selectedAssignment && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <h2>
                  {selectedAssignment.title}
                </h2>

                <p>
                  {selectedAssignment.subject} •{" "}
                  {selectedAssignment.className}
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeSubmissions}
              >
                <X size={20} />
              </button>
            </div>

            {submissionsLoading ? (
              <div className="admin-empty-state">
                Loading submissions...
              </div>
            ) : submissions.length === 0 ? (
              <div className="admin-empty-state">
                <FileText size={32} />

                <p>
                  No students have submitted this
                  assignment yet.
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
<th>Roll No.</th>
<th>Status</th>
<th>Submitted At</th>
<th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {submissions.map(
                      (submission) => (
                        <tr
                          key={submission._id}
                        >
                          <td>
                            {
                              submission.studentName
                            }
                          </td>

                          <td>
                            {submission.rollNo}
                          </td>

                          <td>
                            <span className="status-badge status-active">
                              <CheckCircle
                                size={14}
                              />

                              Submitted
                            </span>
                          </td>

                          <td>
                            {formatSubmittedDate(
                              submission.submittedAt ||
                                submission.createdAt
                            )}
                          </td>

                          <td>
                            <button
                              type="button"
                              className="admin-primary-button"
                              onClick={() =>
                                openSubmissionDetails(submission)
                              }
                            >
                              {submission.status === "Graded" ? `Graded (${submission.marks}/100)` : "Grade / View"}
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={closeSubmissions}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* VIEW SUBMISSION DETAILS MODAL */}

{selectedSubmission && (
  <div className="admin-modal-overlay">
    <div className="admin-modal">
      <div className="admin-modal-header">
        <div>
          <h2>Submission Details</h2>

          <p>
            {selectedSubmission.studentName} •{" "}
            {selectedSubmission.rollNo}
          </p>
        </div>

        <button
          type="button"
          className="admin-modal-close"
          onClick={closeSubmissionDetails}
        >
          <X size={20} />
        </button>
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-group">
          <label>Student Name</label>

          <input
            type="text"
            value={
              selectedSubmission.studentName || ""
            }
            disabled
          />
        </div>

        <div className="admin-form-group">
          <label>Roll Number</label>

          <input
            type="text"
            value={
              selectedSubmission.rollNo || ""
            }
            disabled
          />
        </div>

        <div className="admin-form-group admin-form-full">
          <label>Assignment</label>

          <input
            type="text"
            value={
              selectedAssignment?.title || ""
            }
            disabled
          />
        </div>

        <div className="admin-form-group">
          <label>Status</label>

          <input
            type="text"
            value={
              selectedSubmission.status ||
              "Submitted"
            }
            disabled
          />
        </div>

        <div className="admin-form-group">
          <label>Submitted At</label>

          <input
            type="text"
            value={formatSubmittedDate(
              selectedSubmission.submittedAt ||
                selectedSubmission.createdAt
            )}
            disabled
          />
        </div>

        <div className="admin-form-group admin-form-full">
          <label>Student Answer</label>

          <textarea
            value={
              selectedSubmission.answer || ""
            }
            readOnly
            rows="6"
          />
        </div>

        <div className="admin-form-group">
          <label>Marks (out of 100)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={gradeMarks}
            onChange={(e) => setGradeMarks(e.target.value)}
            placeholder="e.g. 85"
            required
          />
        </div>

        <div className="admin-form-group admin-form-full">
          <label>Faculty Feedback</label>
          <textarea
            value={gradeFeedback}
            onChange={(e) => setGradeFeedback(e.target.value)}
            placeholder="Provide comments or feedback to the student..."
            rows="3"
          />
        </div>
      </div>

      <div className="admin-modal-actions">
        <button
          type="button"
          className="admin-secondary-button"
          onClick={closeSubmissionDetails}
        >
          Close
        </button>

        <button
          type="button"
          className="admin-primary-button"
          onClick={handleSaveGrade}
          disabled={gradingLoading}
        >
          {gradingLoading ? "Saving..." : "Save Grade & Feedback"}
        </button>
      </div>
    </div>
  </div>
)}
    </DashboardLayout>
  );
}

export default Assignments;