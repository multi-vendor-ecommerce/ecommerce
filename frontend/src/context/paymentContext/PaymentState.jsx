import { useState } from "react";
import PaymentContext from "./PaymentContext";

const PaymentState = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const host = "http://localhost:5000";

  // 🔹 Create Razorpay order
  const createRazorpayOrder = async (orderId) => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/payment/razorpay-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to create Razorpay order");

      // return both order + key
      return { razorpayOrder: data.razorpayOrder, key: data.key };
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Confirm Razorpay payment (verify signature)
  const confirmRazorpayPayment = async (orderId, paymentData) => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/payment/confirm-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
        body: JSON.stringify({ orderId, ...paymentData }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return { success: false, message: "Payment confirmation failed" };
    } finally {
      setLoading(false);
    }
  };

  // Confirm COD
  const confirmCOD = async (orderId) => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/payment/confirm-cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      return { success: false, message: "COD confirmation failed" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{ loading, createRazorpayOrder, confirmRazorpayPayment, confirmCOD }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentState;
