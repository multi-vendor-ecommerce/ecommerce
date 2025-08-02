import { useState } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const host = import.meta.env.VITE_BACKEND_URL;
  // const host = "http://localhost:5000";

  const getAllCustomers = async ({ search = "", date = "", page = 1, limit = 10 } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search?.trim()) params.append("search", search);
      if (date?.trim()) params.append("date", date);
      params.append("page", page);
      params.append("limit", limit);

      const response = await fetch(
        `${host}/api/users/admin/all-customers?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("adminToken"),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch customers.");

      const data = await response.json();
      setUsers(data.users);
      setTotalCount(data.total);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ users, totalCount, getAllCustomers, loading }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserState;
