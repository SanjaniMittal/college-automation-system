import { useState } from "react";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
  User,
  Hash,
  Briefcase,
  Building2,
  CheckCircle2,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import "../../../src/login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    role: "student",
    name: "",
    email: "",
    password: "",
    rollNo: "",
    employeeId: "",
    department: "",
    className: "CSE-A",
    course: "B.Tech CSE",
    designation: "Assistant Professor",
    semester: 1,
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleDemoLogin = async (demoRole, demoEmail, demoPass) => {
    setMode("login");
    setFormData((prev) => ({
      ...prev,
      role: demoRole,
      email: demoEmail,
      password: demoPass,
    }));
    setErrorMessage("");
    setSuccessMessage("");
    executeLogin(demoEmail, demoPass, demoRole);
  };

  const executeLogin = async (email, password, role) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await authService.login(email, password, role);

      if (response && response.user) {
        login(response.user, response.token);

        if (response.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (response.user.role === "faculty") {
          navigate("/faculty/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMessage(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
        setErrorMessage("Please fill in your name, email, and password.");
        setLoading(false);
        return;
      }

      if (formData.role === "student" && !formData.rollNo.trim()) {
        setErrorMessage("Roll number is required for student registration.");
        setLoading(false);
        return;
      }

      if (formData.role === "faculty" && !formData.employeeId.trim()) {
        setErrorMessage("Employee ID is required for faculty registration.");
        setLoading(false);
        return;
      }

      const response = await authService.register(formData);

      if (response && response.token && response.user) {
        setSuccessMessage("Account created successfully! Admin has stored your credentials.");
        // Log in the user immediately
        setTimeout(() => {
          login(response.user, response.token);
          if (response.user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (response.user.role === "faculty") {
            navigate("/faculty/dashboard");
          } else {
            navigate("/student/dashboard");
          }
        }, 800);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === "signup") {
      handleSignUp(event);
    } else {
      executeLogin(formData.email, formData.password, formData.role);
    }
  };

  return (
    <div className="login-page">
      <section className="login-brand-section">
        <div className="login-logo">
          <GraduationCap size={32} />
        </div>

        <h1 className="login-brand-name">Acadexa</h1>

        <h2 className="login-heading">
          Intelligent College
          <br />
          Management Platform
        </h2>

        <p className="login-description">
          Manage academics, attendance, assignments, notices, and
          student information from one centralized platform.
        </p>

        <div className="login-features">
          <div>✓ Self-Service Student & Faculty Registration</div>
          <div>✓ Centralized Administrator Credential Storage</div>
          <div>✓ Real-time Attendance & Grade Management</div>
          <div>✓ Dynamic College Circulars & Timetables</div>
        </div>

        {/* Quick Demo Access Bar */}
        <div
          style={{
            marginTop: "32px",
            background: "rgba(255, 255, 255, 0.08)",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
              fontWeight: 600,
              fontSize: "0.85rem",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: "var(--accent, #6366f1)",
            }}
          >
            <Sparkles size={16} /> Quick Demo Access
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() =>
                handleDemoLogin("admin", "admin@acadexa.com", "admin123")
              }
              style={{
                flex: "1 1 calc(33.333% - 8px)",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              onClick={() =>
                handleDemoLogin("faculty", "faculty@acadexa.com", "faculty123")
              }
              style={{
                flex: "1 1 calc(33.333% - 8px)",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              👨‍🏫 Faculty
            </button>
            <button
              type="button"
              onClick={() =>
                handleDemoLogin("student", "student@acadexa.com", "student123")
              }
              style={{
                flex: "1 1 calc(33.333% - 8px)",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              🎓 Student
            </button>
          </div>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-card">
          {/* Mode Switcher Tabs */}
          <div className="auth-mode-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => {
                setMode("signup");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              <UserPlus size={16} /> First Time Sign Up
            </button>
          </div>

          <h2 className="login-title">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="login-subtitle">
            {mode === "signup"
              ? "Register your credentials for first-time access. Admin stores your profile."
              : "Sign in with your registered credentials"}
          </p>

          {mode === "signup" && (
            <div className="first-time-badge">
              <Sparkles size={16} />
              <span>
                <strong>First time here?</strong> Enter your details below. Your
                credentials will be stored in the admin directory for all future logins.
              </span>
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                padding: "10px 14px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "0.85rem",
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                padding: "10px 14px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "0.85rem",
              }}
            >
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="login-label">
              {mode === "signup" ? "Register As" : "Login As"}
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="login-input"
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              {mode === "login" && <option value="admin">Administrator</option>}
            </select>

            {/* Extra signup fields */}
            {mode === "signup" && (
              <>
                <label className="login-label">Full Name</label>
                <div className="login-input-wrapper">
                  <User size={18} className="login-input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="login-input with-icon"
                    disabled={loading}
                  />
                </div>

                {formData.role === "student" ? (
                  <div className="form-row-2col">
                    <div>
                      <label className="login-label">Roll Number</label>
                      <div className="login-input-wrapper">
                        <Hash size={18} className="login-input-icon" />
                        <input
                          type="text"
                          name="rollNo"
                          placeholder="e.g. CSE101"
                          value={formData.rollNo}
                          onChange={handleChange}
                          required
                          className="login-input with-icon"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="login-label">Class Section</label>
                      <input
                        type="text"
                        name="className"
                        placeholder="e.g. CSE-A"
                        value={formData.className}
                        onChange={handleChange}
                        required
                        className="login-input"
                        disabled={loading}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-row-2col">
                    <div>
                      <label className="login-label">Employee ID</label>
                      <div className="login-input-wrapper">
                        <Briefcase size={18} className="login-input-icon" />
                        <input
                          type="text"
                          name="employeeId"
                          placeholder="e.g. FAC010"
                          value={formData.employeeId}
                          onChange={handleChange}
                          required
                          className="login-input with-icon"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="login-label">Designation</label>
                      <input
                        type="text"
                        name="designation"
                        placeholder="e.g. Assistant Professor"
                        value={formData.designation}
                        onChange={handleChange}
                        className="login-input"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <label className="login-label">Department / Branch</label>
                <div className="login-input-wrapper">
                  <Building2 size={18} className="login-input-icon" />
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. Computer Science & Engineering"
                    value={formData.department}
                    onChange={handleChange}
                    className="login-input with-icon"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <label className="login-label">Email Address</label>

            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="login-input with-icon"
                disabled={loading}
              />
            </div>

            <label className="login-label">
              {mode === "signup" ? "Set Password" : "Password"}
            </label>

            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={
                  mode === "signup" ? "Choose a secure password" : "Enter your password"
                }
                value={formData.password}
                onChange={handleChange}
                required
                className="login-input with-icon"
                disabled={loading}
              />

              <button
                type="button"
                className="login-eye-button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {mode === "login" && (
              <div className="login-options">
                <label className="login-remember">
                  <input type="checkbox" defaultChecked />
                  Remember me
                </label>

                <button
                  type="button"
                  className="login-forgot"
                  onClick={() =>
                    alert("For password reset, please contact the College Admin at admin@acadexa.com")
                  }
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading
                ? mode === "signup"
                  ? "Registering Credentials..."
                  : "Signing In..."
                : mode === "signup"
                ? "Register & Sign In"
                : "Sign In"}
            </button>
          </form>

          <div className="login-toggle-prompt">
            {mode === "login" ? (
              <span>
                First time using Acadexa?
                <button
                  type="button"
                  className="login-toggle-link"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already registered?
                <button
                  type="button"
                  className="login-toggle-link"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                >
                  Sign in instead
                </button>
              </span>
            )}
          </div>

          <p className="login-footer">Acadexa © 2026 • College Automation System</p>
        </div>
      </section>
    </div>
  );
}

export default Login;