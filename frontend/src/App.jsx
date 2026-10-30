import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/student/Dashboard";
import StudentAttendance from "./pages/student/MyAttendance";
import Assignments from "./pages/student/Assignments";
import Timetable from "./pages/student/Timetable";
import Notices from "./pages/student/Notices";
import Profile from "./pages/student/Profile";

import FacultyDashboard from "./pages/faculty/Dashboard";
import MyClasses from "./pages/faculty/MyClasses";
import FacultyAttendance from "./pages/faculty/Attendance";
import FacultyAssignments from "./pages/faculty/Assignments";
import FacultyNotices from "./pages/faculty/Notices";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminStudents from "./pages/admin/Students";
import AdminFaculty from "./pages/admin/Faculty";
import AdminCourses from "./pages/admin/Courses";
import AdminAttendance from "./pages/admin/Attendance";
import AdminNotices from "./pages/admin/Notices";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login */}
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignments"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Assignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/timetable"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Timetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notices"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Notices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Faculty Routes */}
          <Route
            path="/faculty/dashboard"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/classes"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <MyClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/attendance"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/assignments"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/notices"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyNotices />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faculty"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminFaculty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notices"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminNotices />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;