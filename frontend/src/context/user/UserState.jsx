import { useState } from "react";
import UserContext from "./UserContext";

const NoteState = (props) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const host = "http://localhost:5000";
  
  const getAllCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${host}/api/user/admin/all-customers`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers.');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider value={{ users, getAllCustomers, loading }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default NoteState;
