import React from "react";
import orders from "../../../data/orderData";

export default function Order() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-user-primary mb-4">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white shadow rounded p-4 mb-4 border-l-4 border-user-primary"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-user-dark">
                Order ID: {order.id}
              </h3>
              <p className="text-sm text-gray-500">Date: {order.date}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-1">
            <strong>Items:</strong> {order.items.join(", ")}
          </p>
          <p className="text-user-primary font-bold">Total: ₹{order.total}</p>
        </div>
      ))}

      {orders.length === 0 && (
        <p className="text-gray-600">You have not placed any orders yet.</p>
      )}
    </div>
  );
}
