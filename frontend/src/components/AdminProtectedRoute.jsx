<<<<<<< HEAD
import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken"); // ✅ FIXED

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

=======
import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken"); // ✅ FIXED

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
export default AdminProtectedRoute;