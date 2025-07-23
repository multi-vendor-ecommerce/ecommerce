// Orders.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const dummyOrders = [
  {
    id: "ORD12345",
    date: "2025-06-20",
    status: "Delivered",
    products: ["T-shirt", "Jeans"],
  },
  {
    id: "ORD67890",
    date: "2025-06-28",
    status: "Pending",
    products: ["Shoes"],
  },
];

export default function Orders() {
  const [orders] = useState(dummyOrders);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded-md mb-4 bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Order #: {order.id}</p>
              <p className="text-sm text-gray-500">Date: {order.date}</p>
              <p className="text-sm">Status: <span className="font-medium">{order.status}</span></p>
              <p className="text-sm">Items: {order.products.join(", ")}</p>
            </div>
            <Link
              to={`/order/${order.id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
