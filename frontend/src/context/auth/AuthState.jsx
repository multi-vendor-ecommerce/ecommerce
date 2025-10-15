import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

const AuthState = ({ children }) => {
  const [authTokens, setAuthTokens] = useState({
    admin: null,
    vendor: null,
    customer: null,
  });

  const [people, setPeople] = useState({
    admin: null,
    vendor: null,
    customer: null,
  });

  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-psww.onrender.com";
  // const host = "http://localhost:5000";

  // ------------------------
  // Decode JWT to get exp
  // ------------------------
  const decodeToken = (token) => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  // ------------------------
  // Initialize tokens on load
  // ------------------------
  useEffect(() => {
    ["admin", "vendor", "customer"].forEach((role) => {
      const token = localStorage.getItem(`${role}Token`);
      if (token) {
        const payload = decodeToken(token);

        if (payload && payload.exp > Date.now() / 1000) {
          setAuthTokens((prev) => ({ ...prev, [role]: token }));
          setPeople((prev) => ({ ...prev, [role]: { role } }));
        } else {
          logout(role);
        }
      }
    });
  }, []);

  // ------------------------
  // Handle successful auth response
  // ------------------------
  const handleAuthSuccess = (response) => {
    const token = response?.data?.authToken;
    const role = response?.data?.role;

    if (!token || !role) {
      return { success: false, message: response?.message || "Invalid auth response" };
    }

    setAuthTokens((prev) => ({ ...prev, [role]: token }));
    setPeople((prev) => ({ ...prev, [role]: { role } }));

    localStorage.setItem(`${role}Token`, token);

    return { success: true, role, message: response?.message || "Authentication successful" };
  };

  // ------------------------
  // Register
  // ------------------------
  const register = async (formData) => {
    setLoading(true);

    try {
      const res = await fetch(`${host}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const response = await res.json();

      if (response.success) {
        return handleAuthSuccess(response);
      } else {
        return { success: false, message: response.message || "Registration failed" };
      }
    } catch (err) {
      return { success: false, message: err.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Login
  // ------------------------
  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const response = await res.json();

      if (response.success) {
        return handleAuthSuccess(response);
      } else {
        return { success: false, message: response.message || "Login failed" };
      }
    } catch (err) {
      return { success: false, message: err.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // OTP Request
  // ------------------------
  const requestOtp = async (email) => {
    setLoading(true);

    try {
      const res = await fetch(`${host}/api/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const response = await res.json();

      if (response.success) {
        return { success: true, message: response.message || "OTP sent! (Only valid for 5 minutes)" };
      } else {
        return { success: false, message: response.message || "Failed to send OTP" };
      }
    } catch (err) {
      return { success: false, message: err.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // OTP Verify
  // ------------------------
  const verifyOtp = async (email, otp) => {
    setLoading(true);

    try {
      const res = await fetch(`${host}/api/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const response = await res.json();

      if (response.success) {
        return handleAuthSuccess(response);
      } else {
        return { success: false, message: response.message || "OTP verification failed" };
      }
    } catch (err) {
      return { success: false, message: err.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Logout
  // ------------------------
  const logout = (role) => {
    if (!role) return;

    localStorage.removeItem(`${role}Token`);

    setAuthTokens((prev) => ({ ...prev, [role]: null }));
    setPeople((prev) => ({ ...prev, [role]: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        people,
        loading,
        login,
        register,
        logout,
        requestOtp,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;