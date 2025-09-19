// src/components/common/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { authTokens } = useContext(AuthContext);
  const token = localStorage.getItem("customerToken") || authTokens?.customer;
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to={`/login/user?redirect=${location.pathname}`}
        replace
      />
    );
  }

  return children;
}