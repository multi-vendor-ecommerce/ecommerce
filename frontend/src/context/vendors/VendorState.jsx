import { useState, useCallback } from "react";
import VendorContext from "./VendorContext";

const VendorState = (props) => {
  const [vendors, setVendors] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";

  const getAllVendors = async ({ search = "", status = "", page = 1, limit = 10 } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search?.trim()) params.append("search", search);
      if (status) params.append("status", status);
      params.append("page", page);
      params.append("limit", limit);

      const response = await fetch(`${host}/api/vendors?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("adminToken"),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch vendors.");

      const data = await response.json();
      if (data.success) {
        setVendors(data.vendors);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Top Selling Products
  const getTopVendors = async ({ search = "", status = "", page = 1, limit = 10 } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search?.trim()) params.append("search", search);
      if (status) params.append("status", status);
      params.append("page", page);
      params.append("limit", limit);

      const response = await fetch(`${host}/api/vendors/top?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("adminToken"),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch top vendors.");

      const data = await response.json();
      if (data.success) {
        setTopVendors(data.vendors);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit vendor shop name and logo
  const editStore = async (formData) => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/vendors/edit/store`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("vendorToken"),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update the store.");

      const data = await response.json();
      // Always return the updated vendor object from backend
      if (data.success && data.vendor) {
        // This vendor object should have the new shopLogo URL
        return { success: true, vendor: data.vendor, message: data.message || "Store updated successfully." };
      } else {
        return { success: false, message: data.message || "Failed to update store." };
      }
    } catch (error) {
      console.error("Error updating store:", error);
      return { success: false, message: error.message || "Failed to update store." };
    } finally {
      setLoading(false);
    }
  };

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
    <VendorContext.Provider value={{ vendors, topVendors, loading, totalCount, getAllVendors, getTopVendors, editStore, getVendorById }}>
      {props.children}
    </VendorContext.Provider>
  )
}

export default VendorState;