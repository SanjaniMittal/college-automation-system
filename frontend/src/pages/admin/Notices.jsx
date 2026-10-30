import { useEffect, useState } from "react";
import { Plus, Megaphone, Edit, Trash2, X } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { API_BASE_URL } from "../../config";

function Notices() {
  const [notices, setNotices] = useState([]);
useEffect(() => {
  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notices`);

      if (!response.ok) {
        throw new Error("Failed to fetch notices");
      }

      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  fetchNotices();
}, []);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    audience: "",
    status: "Published",
  });

  const openAddModal = () => {
    setEditingNotice(null);

    setFormData({
      title: "",
      category: "",
      date: "",
      audience: "",
      status: "Published",
    });

    setShowModal(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);

    setFormData({
      title: notice.title,
      category: notice.category,
      date: notice.date,
      audience: notice.audience,
      status: notice.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNotice(null);
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
    const url = editingNotice
      ? `${API_BASE_URL}/notices/${editingNotice._id}`
      : `${API_BASE_URL}/notices`;

    const method = editingNotice ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  title: formData.title,
  category: formData.category,
  date: formData.date,
  audience: formData.audience,
  status: formData.status,
}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to save notice"
      );
    }

    const savedNotice = await response.json();

    if (editingNotice) {
      setNotices((previous) =>
        previous.map((notice) =>
          notice._id === editingNotice._id
            ? savedNotice
            : notice
        )
      );
    } else {
      setNotices((previous) => [savedNotice, ...previous]);
    }

    closeModal();
  } catch (error) {
    console.error("Notice save error:", error);
    alert(error.message);
  }
};
  const deleteNotice = async (id) => {
    const notice = notices.find((item) => item._id === id);
    if (!notice) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${notice.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notice");
      }

      setNotices((previous) =>
        previous.filter((notice) => notice._id !== id)
      );
    } catch (error) {
      console.error("Notice delete error:", error);
      alert(error.message);
    }
  };

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Notices"
        description="Create and manage college-wide announcements."
      />

      <div className="content-card">
        <div className="content-card-header admin-notice-toolbar">
          <div>
            <h2>Notice Board</h2>
            <p>{notices.length} notices available</p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Create Notice
          </button>
        </div>

        <div className="admin-notice-list">
          {notices.map((notice) => (
            <div className="admin-notice-item" key={notice._id}>
              <div className="admin-notice-icon">
                <Megaphone size={20} />
              </div>

              <div className="admin-notice-info">
                <h3>{notice.title}</h3>

                <div className="admin-notice-details">
                  <span>{notice.category}</span>
                  <span>
                    {notice.date
                      ? new Date(notice.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recent"}
                  </span>
                  <span>{notice.audience}</span>
                </div>
              </div>

              <span
                className={`status-badge ${
                  notice.status === "Published"
                    ? "status-present"
                    : "status-draft"
                }`}
              >
                {notice.status}
              </span>

              <div className="admin-action-buttons">
                <button
                  type="button"
                  className="admin-icon-button"
                  title="Edit notice"
                  onClick={() => openEditModal(notice)}
                >
                  <Edit size={16} />
                </button>

                <button
                  type="button"
                  className="admin-icon-button admin-delete-button"
                  title="Delete notice"
                  onClick={() => deleteNotice(notice._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {notices.length === 0 && (
            <div className="admin-empty-state">
              No notices available.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <h2>
                  {editingNotice ? "Edit Notice" : "Create Notice"}
                </h2>

                <p>
                  {editingNotice
                    ? "Update the notice information."
                    : "Create a new college announcement."}
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
                <div className="admin-form-group admin-form-full">
                  <label>Notice Title</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter notice title"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category</label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Event">Event</option>
                    <option value="General">General</option>
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
                  <label>Audience</label>

                  <select
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select audience</option>
                    <option value="All Students">
                      All Students
                    </option>
                    <option value="All Students & Faculty">
                      All Students & Faculty
                    </option>
                    <option value="CSE Students">
                      CSE Students
                    </option>
                    <option value="Faculty">Faculty</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
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
                  {editingNotice ? "Update Notice" : "Create Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Notices;