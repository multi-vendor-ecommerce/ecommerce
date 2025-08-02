import { useState, useEffect } from "react";
import OrderContext from "./OrderContext";

const OrderState = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminTotalCount, setAdminTotalCount] = useState(0);

  const [vendorOrders, setVendorOrders] = useState([]);
  const [vendorTotalCount, setVendorTotalCount] = useState(0);

  const [userOrders, setUserOrders] = useState([]);
  const [userTotalCount, setUserTotalCount] = useState(0);

  const host = import.meta.env.VITE_BACKEND_URL;
  // const host = "http://localhost:5000";

  // Fetch orders placed by the logged-in customer
  const getMyOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/order/myOrder`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("adminToken")
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
          "auth-token": localStorage.getItem("adminToken")
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

  // Fetch all orders for admin (with optional search, status, pagination)
  const getAllOrders = async ({ search = "", status = "", page = 1, limit = 10 } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search?.trim()) params.append("search", search);
      if (status) params.append("status", status);
      params.append("page", page);
      params.append("limit", limit);

      const res = await fetch(`${host}/api/order/admin?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("adminToken")
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const data = await res.json();
      if (data.success) {
        setAdminOrders(data.orders);        // Set paginated orders
        setAdminTotalCount(data.total);     // Set total for pagination
        
        return { success: true, total: data.total, orders: data.orders }; // optional return
      } else {
        console.error("Server error:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id) => {
    try {
      const response = await fetch(`${host}/api/order/admin/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("adminToken")
          }
        });
      if (!response.ok) {
        throw new Error('Failed to fetch products.');
      }

      const data = await response.json();
      if (data.success) return data.order;
      else return null;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Place a new order (for users)
  const placeOrder = async (orderData) => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("adminToken"),
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
        adminTotalCount,
        userOrders,
        vendorOrders,
        adminOrders,
        placeOrder,
        getMyOrders,
        getVendorOrders,
        getAllOrders,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
