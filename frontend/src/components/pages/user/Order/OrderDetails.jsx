import React, { useState } from "react";
import { useParams } from "react-router-dom";

const orderData = {
  ORD12345: {
    id: "ORD12345",
    date: "2025-06-20",
    status: "Delivered",
    products: [
      { name: "T-shirt", qty: 1, price: 500 },
      { name: "Jeans", qty: 1, price: 1200 },
    ],
    isReturnable: true,
  },
  ORD67890: {
    id: "ORD67890",
    date: "2025-06-28",
    status: "Pending",
    products: [{ name: "Shoes", qty: 1, price: 1500 }],
    isReturnable: false,
  },
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const order = orderData[orderId];

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    comments: "",
  });

  const handleSubmit = () => {
    if (!formData.reason) {
      alert("Please select a reason.");
      return;
    }
    alert(`✅ Return/Refund Request Submitted!\n\nReason: ${formData.reason}\nComments: ${formData.comments || "None"}`);
    setShowForm(false);
    setFormData({ reason: "", comments: "" });
  };

  if (!order) return <div className="p-4">❌ Order not found</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      <p>Order #: <strong>{order.id}</strong></p>
      <p>Date: {order.date}</p>
      <p>Status: {order.status}</p>

      <hr className="my-4" />
      <h3 className="font-medium mb-2">Products:</h3>
      {order.products.map((p, i) => (
        <div key={i} className="flex justify-between text-sm py-1">
          <span>{p.name} (x{p.qty})</span>
          <span>₹{p.price}</span>
        </div>
      ))}

      <hr className="my-4" />

      {order.isReturnable && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Initiate Return / Refund
        </button>
      )}

      {order.isReturnable && showForm && (
        <div className="space-y-4 mt-4">
          <label className="block">
            <span className="text-sm font-medium">Reason for Return</span>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="input mt-1"
            >
              <option value="">Select a reason</option>
              <option value="Damaged Item">Damaged Item</option>
              <option value="Wrong Item Received">Wrong Item Received</option>
              <option value="No Longer Needed">No Longer Needed</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Comments (optional)</span>
            <textarea
              rows={3}
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="input mt-1"
              placeholder="Add any additional info..."
            />
          </label>

          <div className="flex gap-3">
            <button onClick={handleSubmit} className="btn-primary">Submit Request</button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!order.isReturnable && (
        <p className="text-sm text-gray-500 italic">
          ⚠️ This order is not eligible for return/refund.
        </p>
      )}
    </div>
  );
}
