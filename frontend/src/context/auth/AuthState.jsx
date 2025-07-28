import { useState } from "react";
import AuthContext from "./AuthContext";

const AuthState = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";

  // Login Function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.authToken) {
        localStorage.setItem("authToken", data.authToken);
        setAuthToken(data.authToken);
        setUser({ role: data.role }); // TEMP role assignment

        return { success: true, role: data.role };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // OTP Request Function
  const requestOtp = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      return { success: false, error: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // OTP Verify Function
  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success && data.authToken) {
        localStorage.setItem("authToken", data.authToken);
        setAuthToken(data.authToken);
        setUser({ role: data.role });

        return { success: true, role: data.role };
      } else {
        return { success: false, error: data.error || "OTP verification failed" };
      }
    } catch (err) {
      return { success: false, error: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, loading, login, logout, requestOtp, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;