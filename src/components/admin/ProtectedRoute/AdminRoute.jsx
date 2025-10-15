import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../../lib/services/authService.js";

const AdminRoute = ({ children }) => {
  // Sử dụng authService để kiểm tra authentication và admin role
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const isAdmin = () => {
    return authService.isAdmin();
  };

  if (!isAuthenticated()) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin()) {
    // If authenticated but not admin, logout and redirect to admin login with message
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/admin/login?reason=no_permission" replace />;
  }

  return children;
};

export default AdminRoute;
