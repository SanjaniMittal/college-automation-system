import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  X,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const student = {
    name: user?.name || "Aarav Sharma",
    rollNo: user?.rollNo || "CSE001",
  };

  // ------------------------------------
  // FETCH ASSIGNMENTS
  // ------------------------------------

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`);

      if (!response.ok) {
        throw new Error(
          "Failed to fetch assignments"
        );
      }

      const data = await response.json();

      setAssignments(data);
      setError("");
    } catch (error) {
      console.error(
        "Error fetching assignments:",
        error
      );

      setError(
        "Unable to load assignments."
      );
    }
  };

  // ------------------------------------
  // FETCH STUDENT SUBMISSIONS
  // ------------------------------------

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/submissions/student/${student.rollNo}`
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
    }
  };

  // ------------------------------------
  // INITIAL LOAD
  // ------------------------------------

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchAssignments(),
        fetchSubmissions(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // ------------------------------------
  // DATE FORMAT
  // ------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ------------------------------------
  // CHECK SUBMISSION
  // ------------------------------------

  const getSubmission = (assignmentId) => {
    return submissions.find(
      (submission) =>
        submission.assignmentId?._id ===
          assignmentId ||
        submission.assignmentId ===
          assignmentId
    );
  };

  // ------------------------------------
  // OPEN SUBMIT MODAL
  // ------------------------------------

  const openSubmitModal = (assignment) => {
    const existingSubmission =
      getSubmission(assignment._id);

    if (existingSubmission) {
      alert(
        "You have already submitted this assignment."
      );

      return;
    }

    setSelectedAssignment(assignment);
    setAnswer("");
  };

  // ------------------------------------
  // CLOSE MODAL
  // ------------------------------------

  const closeSubmitModal = () => {
    if (submitting) {
      return;
    }

    setSelectedAssignment(null);
    setAnswer("");
  };

  // ------------------------------------
  // SUBMIT ANSWER
  // ------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAssignment) {
      return;
    }

    if (!answer.trim()) {
      alert("Please enter your answer.");

      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_BASE_URL}/submissions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            assignmentId:
              selectedAssignment._id,

            studentName: student.name,

            rollNo: student.rollNo,

            answer: answer.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit assignment."
        );
      }

      // Add the new submission immediately
      setSubmissions((previous) => [
        data,
        ...previous,
      ]);

      alert(
        "Assignment submitted successfully!"
      );

      closeSubmitModal();
    } catch (error) {
      console.error(
        "Error submitting assignment:",
        error
      );

      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------
  // STATISTICS
  // ------------------------------------

  const totalAssignments =
    assignments.length;

  const submittedCount = assignments.filter(
    (assignment) =>
      getSubmission(assignment._id)
  ).length;

  const pendingCount =
    totalAssignments - submittedCount;

  const dueSoonCount = assignments.filter(
    (assignment) => {
      if (!assignment.dueDate) {
        return false;
      }

      if (getSubmission(assignment._id)) {
        return false;
      }

      const today = new Date();

      const dueDate = new Date(
        assignment.dueDate
      );

      const difference =
        dueDate.getTime() -
        today.getTime();

      const days =
        difference /
        (1000 * 60 * 60 * 24);

      return days >= 0 && days <= 7;
    }
  ).length;

  return (
    <DashboardLayout>
      <PageHeader
        title="My Assignments"
        description="View and submit your academic assignments."
      />

      {/* -------------------------------- */}
      {/* STATISTICS */}
      {/* -------------------------------- */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <FileText size={21} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>Total Assignments</p>

            <h3>
              {totalAssignments}
            </h3>

            <span>This semester</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <Clock size={21} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>Pending</p>

            <h3>
              {pendingCount}
            </h3>

            <span>
              Need submission
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <CheckCircle size={21} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>Submitted</p>

            <h3>
              {submittedCount}
            </h3>

            <span>Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <AlertCircle size={21} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>Due Soon</p>

            <h3>
              {dueSoonCount}
            </h3>

            <span>
              Within 7 days
            </span>
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* ASSIGNMENT LIST */}
      {/* -------------------------------- */}

      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>Assignment List</h2>

            <p>
              Keep track of your assignment
              deadlines and submissions.
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
              {assignments.map(
                (assignment) => {
                  const submission =
                    getSubmission(
                      assignment._id
                    );

                  return (
                    <div
                      className="assignment-item"
                      key={assignment._id}
                    >
                      <div className="assignment-icon">
                        <FileText size={20} />
                      </div>

                      <div className="assignment-info">
                        <h3>
                          {assignment.title}
                        </h3>

                        <p>
                          {assignment.subject}

                          {assignment.className &&
                            ` • ${assignment.className}`}
                        </p>

                        <span className="assignment-due">
                          <Clock size={13} />

                          Due:{" "}
                          {formatDate(
                            assignment.dueDate
                          )}
                        </span>
                      </div>

                      <div className="assignment-actions">
                        {submission ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                            <span className="status-badge status-active">
                              <CheckCircle size={14} />
                              {submission.status === "Graded" ? `Graded (${submission.marks}/100)` : "Submitted"}
                            </span>
                            {submission.feedback && (
                              <small style={{ color: "#475569", fontSize: "0.78rem", maxWidth: "220px", textAlign: "right" }}>
                                💬 {submission.feedback}
                              </small>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="page-header-action"
                            onClick={() =>
                              openSubmitModal(
                                assignment
                              )
                            }
                          >
                            <Send
                              size={15}
                            />

                            Submit Answer
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
      </div>

      {/* -------------------------------- */}
      {/* SUBMIT ANSWER MODAL */}
      {/* -------------------------------- */}

      {selectedAssignment && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <h2>
                  Submit Assignment
                </h2>

                <p>
                  {selectedAssignment.title}
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  closeSubmitModal
                }
                disabled={submitting}
              >
                <X size={20} />
              </button>
            </div>

            <div className="assignment-submit-info">
              <p>
                <strong>
                  Subject:
                </strong>{" "}
                {selectedAssignment.subject}
              </p>

              <p>
                <strong>
                  Class:
                </strong>{" "}
                {selectedAssignment.className}
              </p>

              <p>
                <strong>
                  Due Date:
                </strong>{" "}
                {formatDate(
                  selectedAssignment.dueDate
                )}
              </p>
            </div>

            {selectedAssignment.description && (
              <div className="assignment-description">
                <h3>
                  Instructions
                </h3>

                <p>
                  {
                    selectedAssignment.description
                  }
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
            >
              <div className="admin-form-group admin-form-full">
                <label>
                  Your Answer
                </label>

                <textarea
                  value={answer}
                  onChange={(event) =>
                    setAnswer(
                      event.target.value
                    )
                  }
                  placeholder="Write your answer here..."
                  rows="10"
                  disabled={submitting}
                  required
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={
                    closeSubmitModal
                  }
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={submitting}
                >
                  <Send size={16} />

                  {submitting
                    ? "Submitting..."
                    : "Submit Answer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyAssignments;