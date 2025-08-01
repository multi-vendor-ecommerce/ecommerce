import { useState, useCallback } from "react";
import VendorContext from "./VendorContext";

const VendorState = (props) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL;
  // const host = "http://localhost:5000";

  const getAllVendors = async ({ search = "", status = "" } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search?.trim()) params.append("search", search);
      if (status) params.append("status", status);

      const response = await fetch(
        `${host}/api/vendors?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("adminToken")
          }
          // credentials: "include",
        });

      if (!response.ok) throw new Error('Failed to fetch vendors.');

      const data = await response.json();
      setVendors(data.vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  }

  const getVendorById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${host}/api/vendors/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("adminToken")
          }
          // credentials: "include",
        });
      if (!response.ok) throw new Error("Failed to fetch the vendor.");

      const data = await response.json();
      return data.vendor;
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  }, [host]);

  return (
    <VendorContext.Provider value={{ vendors, loading, getAllVendors, getVendorById }}>
      {props.children}
    </VendorContext.Provider>
  )
}

export default VendorState;
