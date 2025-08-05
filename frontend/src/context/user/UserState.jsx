import { useState } from "react";
import UserContext from "./UserContext";

const UserState = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // const host = import.meta.env.VITE_BACKEND_URL
  const host = "http://localhost:5000";

  // Detect role and token
  const getRoleInfo = () => {
    const adminToken = localStorage.getItem("adminToken");
    const vendorToken = localStorage.getItem("vendorToken");

    if (adminToken) return { role: "admin" };
    if (vendorToken) return { role: "vendor" };
    return { role: null, token: null };
  };

  // Fetch all customers (admin/vendor)
  const getAllCustomers = async ({ search = "", date = "", page = 1, limit = 10 } = {}) => {
    try {
      setLoading(true);
      const { role } = getRoleInfo();

      if (!role) {
        console.warn("No valid token or role detected.");
        return;
      }

      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search);
      if (date.trim()) params.append("date", date);
      params.append("page", page);
      params.append("limit", limit);

      const url = `${host}/api/users/${role}/all-customers?${params.toString()}`;

      const headers = { "Content-Type": "application/json" };
      if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
      else if (role === "vendor" && token) headers["auth-token"] = localStorage.getItem("vendorToken");

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) throw new Error("Failed to fetch customers.");

      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
        setTotalCount(data.total || 0);
      } else {
        setUsers([]);
        setTotalCount(0);
      }

      return data;
    } catch (error) {
      console.error("Error fetching customers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        totalCount,
        loading,
        getAllCustomers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
