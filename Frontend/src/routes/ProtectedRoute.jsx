import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user,loading } = useAuth();
  
    if (loading) {
    return <div>Loading...</div>; // spinner / skeleton
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("Not Authorized")
    return <Navigate to="/" replace />; // redirect if not allowed
  }

  return children;
}
