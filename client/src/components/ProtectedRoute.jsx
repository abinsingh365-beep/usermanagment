import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.log("Invalid user data in localStorage");
    localStorage.removeItem("user");
  }

  // No login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role protection
  if (role && user.user_type !== role) {
    // Admin → Admin dashboard
    if (user.user_type === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    // Other users → User dashboard
    if (user.id) {
      return <Navigate to={`/user/${user.id}`} replace />;
    }

    // Fallback
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;