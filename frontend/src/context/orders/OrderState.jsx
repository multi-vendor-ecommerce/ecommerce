import { useState } from "react";
import OrderContext from "./OrderContext";

const OrderState = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";

  // Token + role utility
  const getRoleInfo = () => {
    const adminToken = localStorage.getItem("adminToken");
    const vendorToken = localStorage.getItem("vendorToken");

    if (adminToken) return { role: "admin" };
    else if (vendorToken) return { role: "vendor" };
    else return { role: "customer" };
  };

  const getAllOrders = async ({
    search = "",
    status = "",
    vendorId = "",  // new param
    page = 1,
    limit = 10,
  } = {}) => {
    const { role } = getRoleInfo();

    const params = new URLSearchParams({ page, limit });

    if (search.trim()) params.append("search", search);
    if ((role === "admin" || role === "vendor") && status) params.append("status", status);

    // Append vendorId only if admin and vendorId passed
    if (role === "admin" && vendorId) params.append("vendorId", vendorId);

    const endpoint = role === "admin" ? "admin" : "vendor";
    const url = `${host}/api/orders/${endpoint}?${params.toString()}`;

    const headers = { "Content-Type": "application/json" };
    if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
    else if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");

    try {
      setLoading(true);
      const res = await fetch(url, {
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

  // 🔵 Fetch user's own orders
  const getMyOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/orders/my-order`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
      });

      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Fetch single order by ID (admin/vendor)
  const getOrderById = async (id) => {
    const { role } = getRoleInfo();

    const endpoint = role === "admin" ? "admin" : "vendor";
    const url = `${host}/api/orders/${endpoint}/${id}`;

    const headers = { "Content-Type": "application/json" };
    if (role === "admin") headers["auth-token"] = localStorage.getItem("adminToken");
    else if (role === "vendor") headers["auth-token"] = localStorage.getItem("vendorToken");

    try {
      const res = await fetch(url, {
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

  const placeOrder = async (orderData) => {
    try {
      setLoading(true);

      // Check if auth token exists
      const token = localStorage.getItem("customerToken");
      if (!token) {
        setLoading(false);
        return { success: false, message: "User not authenticated. Please login." };
      }

      const res = await fetch(`${host}/api/orders/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(orderData),
      });

      // Check HTTP response status
      if (!res.ok) {
        let errorMsg = "Failed to place order";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMsg = errorData.message || errorMsg;
          } else {
            // Response is not JSON, maybe HTML or plain text
            errorMsg = await res.text();
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError.message || parseError);
        }
        return { success: false, message: errorMsg };
      }

      const data = await res.json();

      if (data.success) {
        // Refresh orders after successful placement
        await getMyOrders();
        return { success: true, message: "Order placed successfully" };
      } else {
        return { success: false, message: data.message || "Failed to place order" };
      }
    } catch (err) {
      console.error("Error placing order:", err);
      return { success: false, message: "An error occurred while placing the order" };
    } finally {
      setLoading(false);
    }
  };


  return (
    <OrderContext.Provider value={{ loading, orders, totalCount, getAllOrders, getMyOrders, getOrderById, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
