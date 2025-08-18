import React from "react";

const ReviewStep = ({ order, onNext, onBack }) => {
  if (!order?.orderItems || order.orderItems.length === 0) return <p>No items in your order.</p>;

  // calculate total
  const totalPrice = order.orderItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Review Order</h2>

      <div className="border rounded p-3 space-y-2">
        {order.orderItems.map((item, i) => (
          <div key={i} className="flex justify-between py-1 border-b last:border-none">
            <span>{item.product.title} ({item.color}/{item.size}) x {item.quantity}</span>
            <span>₹{item.product.price * item.quantity}</span>
          </div>
        ))}

        <div className="flex justify-between font-bold mt-2">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 border rounded" onClick={onBack}>
          Back
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
