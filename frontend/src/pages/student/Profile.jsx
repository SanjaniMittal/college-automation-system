import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  CalendarDays,
  User,
  Edit,
  Check,
  X,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Profile() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.profile?.phone || "+91 98765 43210");
  const [address, setAddress] = useState(user?.profile?.address || "New Delhi, India");
  const [saving, setSaving] = useState(false);

  const student = {
    name: user?.name || "Aarav Sharma",
    rollNumber: user?.rollNo || "CSE001",
    email: user?.email || "student@acadexa.com",
    department: user?.department || "Computer Science & Engineering",
    className: user?.className || "CSE-A",
    semester: "6th Semester",
    batch: "2024 - 2027",
    dateOfBirth: "15 March 2005",
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/auth/profile", { phone, address });
      updateUser({ profile: { ...user?.profile, phone, address } });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Profile"
        description="View and manage your registered personal and academic credentials."
      />

      <div className="profile-layout">
        <div className="profile-card profile-summary">
          <div className="profile-avatar">
            <User size={42} />
          </div>

          <h2>{student.name}</h2>
          <p>{student.department}</p>
          <span className="profile-role">Student • {student.rollNumber}</span>
        </div>

        <div className="content-card">
          <div className="content-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>Contact Information</h2>
              <p>Your registered contact details</p>
            </div>

            <button
              type="button"
              className="page-header-action"
              onClick={() => setIsEditing(!isEditing)}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              {isEditing ? <><X size={16} /> Cancel</> : <><Edit size={16} /> Edit Info</>}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} style={{ padding: "16px 0" }}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Check size={16} /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <Mail size={18} />
                <div>
                  <span>Email Address</span>
                  <strong>{student.email}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <Phone size={18} />
                <div>
                  <span>Phone Number</span>
                  <strong>{phone}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <MapPin size={18} />
                <div>
                  <span>Address</span>
                  <strong>{address}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <CalendarDays size={18} />
                <div>
                  <span>Date of Birth</span>
                  <strong>{student.dateOfBirth}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="content-card profile-academic-card">
        <div className="content-card-header">
          <div>
            <h2>Academic Details</h2>
            <p>Official enrollment and department records</p>
          </div>

          <GraduationCap size={22} />
        </div>

        <div className="profile-academic-grid">
          <div>
            <span>Roll Number</span>
            <strong>{student.rollNumber}</strong>
          </div>

          <div>
            <span>Class Section</span>
            <strong>{student.className}</strong>
          </div>

          <div>
            <span>Department</span>
            <strong>{student.department}</strong>
          </div>

          <div>
            <span>Semester</span>
            <strong>{student.semester}</strong>
          </div>

          <div>
            <span>Batch</span>
            <strong>{student.batch}</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;