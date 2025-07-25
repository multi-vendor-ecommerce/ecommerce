import { useState, useEffect } from "react";
import OrderContext from "./OrderContext";

const OrderState = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";
  const token = localStorage.getItem("authToken");

  // Fetching my orders
  const getMyOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/order/myOrder`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  // placing an Order
  const placeOrder = async (orderData) => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });
      const data = await res.json();
      if (data.success) {
        getMyOrders();
        return { success: true, message: "Order placed successfully" };
      } else {
        return { success: false, message: data.message || "Failed to place order" };
      }
    } catch (err) {
      console.error("Error placing order:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetching all orders for admin (with optional filters)
  const getAllOrders = async ({ search = "", status = "" } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search?.trim()) params.append("search", search);
      if (status) params.append("status", status);

      const res = await fetch(`${host}/api/order/admin?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else console.error("Server Error:", data.message || "Unknown error");
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Vendor orders
  const getVendorOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/order/vendor`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      placeOrder,
      getMyOrders,
      getAllOrders,
      getVendorOrders,
      loading
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderState;