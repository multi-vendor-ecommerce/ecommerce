import { useState } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";
  const token = localStorage.getItem("authToken");

  const getAllCustomers = async ({ search = "", date = "" } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search?.trim()) params.append("search", search);
      if (date?.trim()) params.append("date", date);

      const response = await fetch(
        `${host}/api/users/admin/all-customers?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token
          }
          // credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch customers.");

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ users, getAllCustomers, loading }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserState;
