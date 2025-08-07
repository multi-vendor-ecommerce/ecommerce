import { useState } from "react";
import PersonContext from "./PersonContext";

const PersonState = (props) => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(false);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";

  // Detect role and token
  const getRoleInfo = () => {
    const adminToken = localStorage.getItem("adminToken");
    const vendorToken = localStorage.getItem("vendorToken");
    const customerToken = localStorage.getItem("customerToken");

    if (adminToken) return { role: "admin" };
    if (vendorToken) return { role: "vendor" };
    if (customerToken) return { role: "customer" };
    return { role: null };
  };

  const getCurrentPerson = async () => {
    const { role } = getRoleInfo();
    
    try {
      setLoading(true);

      if (!role) {
        console.warn("No valid role detected.");
        return;
      }

      const headers = { "Content-Type": "application/json" };
      if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
      else if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");
      else headers["auth-token"] = localStorage.getItem("customerToken");

      const response = await fetch(`${host}/api/person/me`, {
        method: "GET",
        headers,
      });

      if (!response.ok) throw new Error(`Failed to fetch current ${role}.`);

      const data = await response.json();
      if (data.success) setPerson(data.person);
    } catch (error) {
      console.error(`Error fetching current ${role}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PersonContext.Provider value={{ person, loading, getCurrentPerson }}>
      {props.children}
    </PersonContext.Provider>
  )
}

export default PersonState;

