// Components/ProtectedRoutes/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  isAuthenticated,
  role,
  requiredRole,
  redirectPath = "/login",
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Optionally redirect unauthorized roles to home or an unauthorized page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
