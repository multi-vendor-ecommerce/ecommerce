import { useState, useEffect } from "react";
import OrderContext from "./OrderContext";

const OrderState = ({ children }) => {
  const [userOrders, setUserOrders] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";
  const token = localStorage.getItem("authToken");

  // Fetch orders placed by the logged-in customer
  const getMyOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/order/myOrder`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
        // credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUserOrders(data.orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders belonging to a vendor
  const getVendorOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/order/vendor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
        // credentials: "include",
      });
      const data = await res.json();
      if (data.success) setVendorOrders(data.orders);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all orders for admin (with optional search and filter)
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
          "auth-token": token
        }
        // credentials: "include",
      });
      const data = await res.json();
      if (data.success) setAdminOrders(data.orders);
      else console.error("Server error:", data.message || "Unknown error");
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Place a new order (for users)
  const placeOrder = async (orderData) => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (data.success) {
        getMyOrders(); // Refresh user orders
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
    <OrderContext.Provider
      value={{
        loading,
        userOrders,
        vendorOrders,
        adminOrders,
        placeOrder,
        getMyOrders,
        getVendorOrders,
        getAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
