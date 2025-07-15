import { useState } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL;

  const getAllCustomers = async ({ search = "", date = "" } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (date) params.append("date", date); // should be YYYY-MM-DD

      const response = await fetch(`${host}/api/user/admin/all-customers?${params.toString()}`,
        {
          method: "GET",
          credentials: "include"
        });

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
