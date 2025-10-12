import { useState } from "react";
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

  // Register Function
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success && data.data.authToken) {
        const role = data.data.role;
        const updatedTokens = { ...authTokens, [role]: data.data.authToken };
        const updatedPeople = { ...people, [role]: { role } };
        setAuthTokens(updatedTokens);
        setPeople(updatedPeople);
        localStorage.setItem(`${role}Token`, data.data.authToken);

        return {
          success: true,
          role,
          message: data.message || "Registration successful.",
          error: null
        };
      } else {
        return {
          success: false,
          role: null,
          message: null,
          error: data.message || "Registration failed."
        };
      }
    } catch (err) {
      return {
        success: false,
        role: null,
        message: null,
        error: err.message || "Something went wrong."
      };
    } finally {
      setLoading(false);
    }
  };

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

      if (data.success && data.data.authToken) {
        const role = data.data.role;
        const updatedTokens = { ...authTokens, [role]: data.data.authToken };
        const updatedPeople = { ...people, [role]: { role } };
        setAuthTokens(updatedTokens);
        setPeople(updatedPeople);
        localStorage.setItem(`${role}Token`, data.data.authToken);

        return {
          success: true,
          role,
          message: data.message || "Login successful.",
        };
      } else {
        return {
          success: false,
          error: data.message || "Login failed."
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.message || "Something went wrong."
      };
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

      if (data.success) {
        return {
          success: true,
          message: data.message || "OTP sent! (Only valid for 5 minutes)",
        };
      } else {
        return {
          success: false,
          error: data.message || "Failed to send OTP"
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.message || "Something went wrong."
      };
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

      if (data.success && data.data.authToken) {
        const role = data.data.role;
        const updatedTokens = { ...authTokens, [role]: data.data.authToken };
        const updatedPeople = { ...people, [role]: { role } };
        setAuthTokens(updatedTokens);
        setPeople(updatedPeople);
        localStorage.setItem(`${role}Token`, data.data.authToken);

        return {
          success: true,
          role,
          message: data.message || "OTP verified and login successful.",
        };
      } else {
        return {
          success: false,
          error: data.message || "OTP verification failed."
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.message || "Something went wrong."
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = (role) => {
    if (!role) return;

    localStorage.removeItem(`${role}Token`);

    setAuthTokens((prev) => ({ ...prev, [role]: null }));
    setPeople((prev) => ({ ...prev, [role]: null }));
  };

  return (
    <AuthContext.Provider value={{
      authTokens,
      people,
      loading,
      login,
      register,
      logout,
      requestOtp,
      verifyOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;