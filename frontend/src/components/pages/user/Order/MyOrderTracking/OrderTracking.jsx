import React from "react";
import { FaTruck, FaCheckCircle, FaBoxOpen, FaClipboardList, FaCog } from "react-icons/fa";

const OrderTracking = ({ order }) => {
  if (!order) return null;

  // ✅ Match backend statuses
  const steps = [
    { label: "Pending", icon: <FaClipboardList />, status: "pending" },
    { label: "Processing", icon: <FaCog />, status: "processing" },
    { label: "Shipped", icon: <FaTruck />, status: "shipped" },
    { label: "Out for Delivery", icon: <FaBoxOpen />, status: "out for delivery" },
    { label: "Delivered", icon: <FaCheckCircle />, status: "delivered" },
  ];

  // ✅ normalize orderStatus from backend (in case it comes in different case)
  const normalizedStatus = order.orderStatus?.toLowerCase();
  const currentStepIndex = steps.findIndex((s) => s.status === normalizedStatus);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4">Track Order</h3>
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              {/* Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                ${isCompleted ? "bg-green-600 text-white border-green-600" : "bg-gray-200 text-gray-500 border-gray-300"}`}
              >
                {step.icon}
              </div>

              {/* Label */}
              <span
                className={`text-xs mt-2 text-center w-full ${
                  isCompleted ? "text-green-600 font-medium" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-1 -z-10 
                  ${index < currentStepIndex ? "bg-green-500" : "bg-gray-300"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Estimated Delivery */}
      <p className="mt-4 text-sm text-gray-600">
        Estimated Delivery:{" "}
        <span className="font-medium">
          {order.deliveredAt
            ? new Date(order.deliveredAt).toLocaleDateString()
            : new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toDateString()}
        </span>
      </p>
    </div>
  );
};

export default OrderTracking;
