import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their own role dashboard
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "faculty") return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
