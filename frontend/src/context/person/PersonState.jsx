import { useState } from "react";
import PersonContext from "./PersonContext";

const PersonState = (props) => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-psww.onrender.com";
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

  const editPerson = async (formData) => {
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

      const response = await fetch(`${host}/api/person/edit/me`, {
        method: "PUT",
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setPerson(data.updatedPerson);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Failed to update profile." };
      }
    } catch (error) {
      console.error("Error updating person:", error);
      return { success: false, message: "Server error" };
    } finally {
      setLoading(false);
    }
  };

  // New deletePerson function
  const deletePerson = async () => {
    const { role } = getRoleInfo();

    try {
      setLoading(true);
      if (!role) {
        console.warn("No valid role or token.");
        return { success: false, message: "Unauthorized" };
      }

      if (role === "admin") {
        return { success: false, message: "Admin account deletion not allowed here." };
      }

      const headers = {};;
      if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");
      else if (role === "customer") headers["auth-token"] = localStorage.getItem("customerToken");

      const response = await fetch(`${host}/api/person/me`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();

      if (data.success) {
        setPerson(null);
        // Optionally clear tokens from localStorage after deletion
        if (role === "vendor") localStorage.removeItem("vendorToken");
        else if (role === "customer") localStorage.removeItem("customerToken");

        return { success: true, message: data.message || "Account deleted successfully." };
      } else {
        return { success: false, message: data.message || "Failed to delete account." };
      }
    } catch (error) {
      console.error("Error deleting person:", error);
      return { success: false, message: "Server error" };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
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

      const response = await fetch(`${host}/api/person/change-password`, {
        method: "PUT",
        headers,
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: data.message || "Password updated successfully." };
      } else {
        return { success: false, message: data.message || "Failed to change password. Try again." };
      }
    } catch (error) {
      console.error("Error changing password:", error);
      return { success: false, message: "Server error" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <PersonContext.Provider value={{ person, loading, getCurrentPerson, editPerson, deletePerson, changePassword }}>
      {props.children}
    </PersonContext.Provider>
  )
}

export default PersonState;