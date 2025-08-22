import React from "react";

const PaymentStep = ({ modeOfPayment, setModeOfPayment, handlePayment }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Payment</h2>

      {/* Payment options */}
      <select
        value={modeOfPayment}
        onChange={(e) => setModeOfPayment(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="COD">Cash on Delivery</option>
        <option value="ONLINE">Online Payment</option>
      </select>

      {/* Confirm Button */}
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default PaymentStep;
