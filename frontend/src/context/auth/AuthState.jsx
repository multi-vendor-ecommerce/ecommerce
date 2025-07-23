import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthState = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL;

  // fetch user details if token is present
  useEffect(() => {
    if (authToken) {
      getUserDetails();
    }
  }, [authToken]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("authToken", data.authToken);
        setAuthToken(data.authToken);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }

    } catch (err) {
      console.error("Login error: ", err);
      return { success: false, error: "Something went wrong" }
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
  }

  const getUserDetails = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch(`${host}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "Content-Type": "applicaiton/json",
          "auth-token": authToken,
        },
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Fetching user error: ", err);
      logout();
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>

  )
}

export default AuthState;