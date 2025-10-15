import { useState, useCallback } from "react";
import OrderContext from "./OrderContext";

const OrderState = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // const host = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-psww.onrender.com";
  const host = "http://localhost:5000";

  // Utility to get role
  const getRoleInfo = () => {
    const adminToken = localStorage.getItem("adminToken");
    const vendorToken = localStorage.getItem("vendorToken");
    if (adminToken) return { role: "admin" };
    else if (vendorToken) return { role: "vendor" };
    else return { role: "customer" };
  };

  // Create / Update Draft Order
  const createOrderDraft = async (orderData) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/orders/create-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create draft order");

      return { success: true, draftOrderId: data.draftId };
    } catch (err) {
      console.error("Error creating draft:", err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch Single Draft (Customer)
  const getUserDraftOrderById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/orders/draft/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch draft order");
      return data.order;
    } catch (err) {
      console.error("Error fetching user draft order:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [host]);

  // Fetch All Orders (Admin/Vendor)
  const getAllOrders = async ({ search = "", status = "", date = "", vendorId = "", page = 1, limit = 10 } = {}) => {
    setLoading(true);
    try {
      const { role } = getRoleInfo();

      const params = new URLSearchParams({ page, limit });
      if (search.trim()) params.append("search", search);
      if (status) params.append("status", status);
      if (date) params.append("date", date);

      if (role === "admin" && vendorId) params.append("vendorId", vendorId);

      let endpoint;
      if (role === "customer") endpoint = "/api/orders";
      else endpoint = `/api/orders/${role}`;

      const headers = {
        "Content-Type": "application/json",
        "auth-token": role === "customer"
          ? localStorage.getItem("customerToken")
          : role === "admin"
            ? localStorage.getItem("adminToken")
            : localStorage.getItem("vendorToken"),
      };
      const res = await fetch(`${host}${endpoint}?${params.toString()}`, {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch orders");

      setOrders(data.orders || []);
      setTotalCount(data.total || 0);
      return { success: true, total: data.total, orders: data.orders };
    } catch (err) {
      console.error("Error fetching orders:", err);
      return { success: false, orders: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Fetch Single Order (Admin/Vendor)
  const getOrderById = async (id) => {
    const { role } = getRoleInfo();

    let endpoint;
    if (role === "customer") endpoint = `/api/orders/${id}`;
    else endpoint = `/api/orders/${role}/${id}`;

    const headers = {
      "Content-Type": "application/json",
      "auth-token": role === "customer"
        ? localStorage.getItem("customerToken")
        : role === "admin"
          ? localStorage.getItem("adminToken")
          : localStorage.getItem("vendorToken"),
    };
    try {
      const res = await fetch(`${host}${endpoint}`, {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch order");
      return data.order;
    } catch (err) {
      console.error("Error fetching order:", err);
      return null;
    }
  };

  // Fetch Sales Trend (Admin/Vendor)
  const getSalesTrend = async (range = "7d") => {
    const { role } = getRoleInfo();
    if (!["admin", "vendor"].includes(role)) {
      console.error("Sales trend is only available for admin and vendor.");
      return [];
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (range) params.append("range", range);

      const res = await fetch(`${host}/api/orders/sales-trend?${params.toString()}`, {
        headers: {
          "auth-token": role === "admin"
            ? localStorage.getItem("adminToken")
            : role === "vendor" ? localStorage.getItem("vendorToken")
              : null,
        },
      });
      const data = await res.json();
      const trend = data.salesTrend || [];
      setSalesData(trend); // store in state
      return trend;
    } catch (error) {
      console.error("Error fetching sales trend:", error);
      setSalesData([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const pushOrder = async (id, formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/orders/create-order/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("vendorToken"),
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch order");

      return data;
    } catch (err) {
      console.error("Error fetching order:", err);
      return { success: false, message: err.message || "Failed to fetch order" };
    } finally {
      setLoading(false);
    }
  }

  const generateAWBForOrder = async (id) => {
    setLoading(true);
    const { role } = getRoleInfo();

    let headers = {
      "Content-Type": "application/json",
      "auth-token": role === "admin"
        ? localStorage.getItem("adminToken")
        : localStorage.getItem("vendorToken"),
    }

    try {
      const res = await fetch(`${host}/api/orders/assign-awb/${id}`, {
        method: "PUT",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "Failed to generate AWB" };
      }

      return data;
    } catch (error) {
      console.error("Error generating AWB:", error);
      return { success: false, message: error.message || "Failed to generate AWB" };
    } finally {
      setLoading(false);
    }
  }

  const generateDocs = async (id) => {
    setLoading(true);
    const { role } = getRoleInfo();

    let headers = {
      "Content-Type": "application/json",
      "auth-token": role === "admin"
        ? localStorage.getItem("adminToken")
        : localStorage.getItem("vendorToken"),
    }

    try {
      const res = await fetch(`${host}/api/orders/generate-docs/${id}`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to generate documents");

      return data;
    } catch (error) {
      console.error("Error generating documents:", error);
      return { success: false, message: error.message || "Failed to generate documents" };
    } finally {
      setLoading(false);
    }
  }

  // Cancel Order (Customer)
  const cancelOrder = async (id) => {
    setLoading(true);
    const { role } = getRoleInfo();

    try {
      const res = await fetch(`${host}/api/orders/cancel-order/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": role === "admin"
            ? localStorage.getItem("adminToken")
            : role === "vendor" ? localStorage.getItem("vendorToken")
              : localStorage.getItem("customerToken"),
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return { success: false, message: error.message || "Failed to cancel order" };
    }
  };

  return (
    <OrderContext.Provider value={{
      loading,
      orders,
      salesData,
      totalCount,
      createOrderDraft,
      getAllOrders,
      getOrderById,
      getUserDraftOrderById,
      pushOrder,
      generateAWBForOrder,
      generateDocs,
      cancelOrder,
      getSalesTrend,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;