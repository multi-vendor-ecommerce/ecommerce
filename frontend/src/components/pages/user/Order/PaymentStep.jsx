import React from "react";

const PaymentStep = ({ modeOfPayment, setModeOfPayment, handlePayment, loading }) => {
  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <h2 className="text-xl font-bold">Payment</h2>

      {/* Payment options */}
      <select
        value={modeOfPayment}
        onChange={(e) => setModeOfPayment(e.target.value)}
        className="border p-2 rounded w-full"
        required
      >
        <option value="COD">Cash on Delivery</option>
        <option value="ONLINE">Online Payment</option>
      </select>

      {/* Confirm Order Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
      >
        {loading ? "Processing..." : "Confirm Order"}
      </button>
    </form>
  );
};

export default PaymentStep;
