import React, { useState } from "react";

const Checkout = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add validation and submission logic later here
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="address" className="block font-semibold mb-1">
            Shipping Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={shippingInfo.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your address"
          />
          {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="city" className="block font-semibold mb-1">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={shippingInfo.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter city"
          />
          {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="country" className="block font-semibold mb-1">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={shippingInfo.country}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter country"
          />
          {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="paymentMethod" className="block font-semibold mb-1">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Select a payment method</option>
            <option value="COD">Cash On Delivery (COD)</option>
            <option value="Online">Online Payment</option>
          </select>
          {errors.paymentMethod && (
            <p className="text-red-600 text-sm mt-1">{errors.paymentMethod}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded w-full transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
