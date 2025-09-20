import { useState } from "react";
import InvoiceContext from "./InvoiceContext";

const InvoiceState = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";

  const getAllInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/invoices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to fetch invoices");

      setInvoices(data.invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{ loading, invoices, getAllInvoices }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceState;
