import { useState, useCallback } from "react";
import OrderContext from "./OrderContext";

const OrderState = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const host = "http://localhost:5000";

  // ------------------- Helper: Get role & token -------------------
  const getRoleInfo = () => {
    if (localStorage.getItem("adminToken")) return { role: "admin", token: localStorage.getItem("adminToken") };
    if (localStorage.getItem("vendorToken")) return { role: "vendor", token: localStorage.getItem("vendorToken") };
    return { role: "customer", token: localStorage.getItem("customerToken") };
  };

  // ------------------- 1. Create / Update Draft -------------------
  const createOrderDraft = async (orderData) => {
    setLoading(true);
    try {
      const token = getRoleInfo().token;
      const res = await fetch(`${host}/api/orders/create-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
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

  // ------------------- 2. Confirm Order -------------------
  const confirmOrder = async ({ orderId, paymentMethod, shippingInfo }) => {
    setLoading(true);
    try {
      const token = getRoleInfo().token;
      const res = await fetch(`${host}/api/orders/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify({ orderId, paymentMethod, shippingInfo }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to confirm order");

      // Refresh user's orders after confirmation
      await getMyOrders();

      return { success: true, order: data.order };
    } catch (err) {
      console.error("Error confirming order:", err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ------------------- 3. Fetch All Orders (Admin/Vendor) -------------------
  const getAllOrders = async ({ search = "", status = "", vendorId = "", page = 1, limit = 10 } = {}) => {
    setLoading(true);
    try {
      const { role, token } = getRoleInfo();
      const params = new URLSearchParams({ page, limit });
      if (search.trim()) params.append("search", search);
      if ((role === "admin" || role === "vendor") && status) params.append("status", status);
      if (role === "admin" && vendorId) params.append("vendorId", vendorId);

      const endpoint = role === "admin" ? "admin" : "vendor";
      const res = await fetch(`${host}/api/orders/${endpoint}?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
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

  // ------------------- 4. Fetch My Orders -------------------
  const getMyOrders = async () => {
    setLoading(true);
    try {
      const token = getRoleInfo().token;
      const res = await fetch(`${host}/api/orders/my-order`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
      });

      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
      return data;
    } catch (err) {
      console.error("Error fetching my orders:", err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ------------------- 5. Fetch Single Order -------------------
  const getOrderById = async (id) => {
    try {
      const { role, token } = getRoleInfo();
      const endpoint = role === "admin" ? "admin" : "vendor";

      const res = await fetch(`${host}/api/orders/${endpoint}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch order");

      return data.order;
    } catch (err) {
      console.error("Error fetching order:", err);
      return null;
    }
  };

  // ------------------- 6. Fetch Single Draft (Customer) -------------------
  const getUserDraftOrderById = useCallback(async (id) => {
    setLoading(true);
    try {
      const token = getRoleInfo().token;
      const res = await fetch(`${host}/api/orders/draft/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "auth-token": token },
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

  return (
    <OrderContext.Provider
      value={{
        loading,
        orders,
        totalCount,
        createOrderDraft,
        confirmOrder,
        getAllOrders,
        getMyOrders,
        getOrderById,
        getUserDraftOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
