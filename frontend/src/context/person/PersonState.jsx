import { useState } from "react";
import PersonContext from "./PersonContext";

const PersonState = (props) => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL;
  // const host = "http://localhost:5000";

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
        return { success: false, message: "Unauthorized" };
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

  const editPerson = async (updatedData) => {
    const { role } = getRoleInfo();

    try {
      setLoading(true);
      if (!role) {
        console.warn("No valid role or token.");
        return { success: false, message: "Unauthorized" };
      }

      const headers = { "Content-Type": "application/json" };
      if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
      else if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");
      else headers["auth-token"] = localStorage.getItem("customerToken");

      const formData = new FormData();

      for (const key in updatedData) {
        const value = updatedData[key];

        if (value !== undefined && value !== null) {
          // 👇 Handle nested objects using dot notation
          if (typeof value === "object" && !(value instanceof File)) {
            for (const nestedKey in value) {
              if (typeof value[nestedKey] === "object") {
                for (const deepKey in value[nestedKey]) {
                  formData.append(`${key}.${nestedKey}.${deepKey}`, value[nestedKey][deepKey]);
                }
              } else {
                formData.append(`${key}.${nestedKey}`, value[nestedKey]);
              }
            }
          } else {
            formData.append(key, value);
          }
        }
      }
      const response = await fetch(`${host}/api/person/edit/me`, {
        method: "PUT",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPerson(data.updatedPerson);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Update failed." };
      }
    } catch (error) {
      console.error("Error updating person:", error);
      return { success: false, message: "Server error" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <PersonContext.Provider value={{ person, loading, getCurrentPerson, editPerson }}>
      {props.children}
    </PersonContext.Provider>
  )
}

export default PersonState;