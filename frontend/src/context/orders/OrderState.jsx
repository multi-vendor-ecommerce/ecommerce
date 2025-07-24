import { useState, useEffect } from "react";
import OrderContetxt from "./OrderContext";

const OrderState = ({ children }) => {
    const [orders, setOrders] = useState([]);
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

    useEffect(() => {
        if (token) getMyOrders();
    }, []);

    return (     
        <OrderContetxt.Provider value={{ orders, placeOrder, getMyOrders }}>
            { children }
        </OrderContetxt.Provider>
    )
}