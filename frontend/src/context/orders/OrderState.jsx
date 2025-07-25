import { useState, useEffect } from "react";
import OrderContext from "./OrderContext";

const OrderState = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const host = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

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

  // Fetching all orders for admin
  const getAllOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/order/admin`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });
      const data = await res.json();
      if (data.success) setAdminOrders(data.orders);
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
      if (data.success) setVendorOrders(data.orders);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      adminOrders,
      vendorOrders,
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