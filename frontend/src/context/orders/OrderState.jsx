import { useState, useCallback } from "react";
import OrderContext from "./OrderContext";

const OrderState = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

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
  const getAllOrders = async ({ search = "", status = "", vendorId = "", page = 1, limit = 10 } = {}) => {
    setLoading(true);
    try {
      const { role } = getRoleInfo();
      const params = new URLSearchParams({ page, limit });
      if (search.trim()) params.append("search", search);
      if ((role === "admin" || role === "vendor") && status) params.append("status", status);
      if (role === "admin" && vendorId) params.append("vendorId", vendorId);

      const endpoint = role === "admin" ? "admin" : "vendor";
      const headers = {
        "Content-Type": "application/json",
        "auth-token": role === "admin"
          ? localStorage.getItem("adminToken")
          : localStorage.getItem("vendorToken"),
      };
      const res = await fetch(`${host}/api/orders/${endpoint}?${params.toString()}`, {
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
    const endpoint = role === "admin" ? "admin" : "vendor";
    const headers = {
      "Content-Type": "application/json",
      "auth-token": role === "admin"
        ? localStorage.getItem("adminToken")
        : localStorage.getItem("vendorToken"),
    };
    try {
      const res = await fetch(`${host}/api/orders/${endpoint}/${id}`, {
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

  return (
    <OrderContext.Provider value={{
      loading,
      orders,
      totalCount,
      createOrderDraft,
      getAllOrders,
      getOrderById,
      getUserDraftOrderById,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
