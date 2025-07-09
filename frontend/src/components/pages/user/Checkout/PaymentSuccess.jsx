import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function PaymentSuccess() {
  const orderId = "ORD987654321"; // 🚀 This can be dynamically generated later

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <FaCheckCircle className="text-green-500 text-6xl mb-4" />

      <h2 className="text-2xl font-bold text-user-primary mb-2">
        Payment Successful 🎉
      </h2>
      <p className="text-user-dark mb-4">
        Thank you for your purchase! Your order has been placed.
      </p>

      <p className="text-sm text-gray-500 mb-6">
        <strong>Order ID:</strong> {orderId}
      </p>

      <div className="flex gap-4">
        <Link
          to="/products"
          className="bg-user-primary text-white px-4 py-2 rounded hover:bg-user-secondary transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/profile/orders"
          className="bg-gray-100 text-user-dark px-4 py-2 rounded hover:bg-user-base transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
