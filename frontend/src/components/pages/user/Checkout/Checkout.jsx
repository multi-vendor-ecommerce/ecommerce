import React, { useState } from "react";
import { checkoutCartItems } from "../Utils/checkoutData";

export default function Checkout() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const totalAmount = checkoutCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order Placed Successfully! 🎉");
  };

  return (
    <div className="mt-16 bg-user-base min-h-screen text-user-dark p-4">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left - Shipping Form */}
        <form onSubmit={handleSubmit} className="w-full lg:w-2/3 bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold mb-4">Shipping Details</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full border p-2 rounded"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <textarea
            name="address"
            placeholder="Address"
            className="w-full border p-2 rounded"
            value={form.address}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="text"
            name="city"
            placeholder="City"
            className="w-full border p-2 rounded"
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            className="w-full border p-2 rounded"
            value={form.pincode}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-user-primary text-white py-2 rounded hover:bg-user-secondary"
          >
            Place Order
          </button>
        </form>

        {/* Right - Order Summary */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          {checkoutCartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-contain bg-gray-100 rounded"
                />
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-user-primary font-semibold">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}

          <hr className="my-4" />
          <div className="flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
