import { useState } from "react";
import InvoiceContext from "./InvoiceContext";

const InvoiceState = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";

  // Detect role and token
  const getRoleInfo = () => {
    const adminToken = localStorage.getItem("adminToken");
    const vendorToken = localStorage.getItem("vendorToken");

    if (adminToken) return { role: "admin" };
    if (vendorToken) return { role: "vendor" };
    return { role: null, token: null };
  };


  const getAllInvoices = async ({ search = "", date = "", page = 1, limit = 10 } = {}) => {
    setLoading(true);
    try {
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

      const headers = { "Content-Type": "application/json" };
      if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
      else if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");

      const response = await fetch(`${host}/api/invoices/${role}`, {
        method: "GET",
        headers,
      });

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch invoices");

      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices || []);
        setTotalCount(data.total || 0);
      } else {
        setInvoices([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{ loading, invoices, totalCount, getAllInvoices }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceState;
