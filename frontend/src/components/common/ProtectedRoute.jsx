// src/components/common/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("customerToken");
  const location = useLocation();

  if (!token) {
    // Redirect to login, keeping track of the page user was trying to visit
    return <Navigate to={`/login/user?redirect=${location.pathname}`} replace />;
  }

  return children;
}
