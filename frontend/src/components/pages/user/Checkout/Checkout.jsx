import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderContext from "../../../../context/orders/OrderContext";
import { calculateCheckoutTotals } from "../Utils/cartHelpers.js"; // your util for total calc
import { getFinalPrice } from "../Utils/priceUtils.js";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];

  const { placeOrder, loading } = useContext(OrderContext);

  // Shipping & Payment form state
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});

  // Calculate totals on cart change
  const totals = calculateCheckoutTotals(cart);

  // Handle form changes
  const handleChange = (e) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Simple form validation
  const validateForm = () => {
    const newErrors = {};
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.country.trim()) newErrors.country = "Country is required";
    if (!paymentMethod) newErrors.paymentMethod = "Payment method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler to place order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Format orderItems as per your backend schema
    const orderItems = cart.map(({ product, quantity }) => ({
      name: product.title,
      price: getFinalPrice(product.price, product.discount),
      quantity,
      image: product.image,
      product: product._id,
    }));

    // Prepare order data payload matching your backend schema
    const orderData = {
      shippingInfo: {
        address: shippingInfo.address.trim(), 
        city: shippingInfo.city.trim(),
        country: shippingInfo.country.trim(),
      },
      orderItems,
      paymentMethod,
      itemPrice: totals.itemPrice,
      tax: totals.tax,
      shippingCharges: totals.shippingCharges,
      totalAmount: totals.totalAmount,
      // user and vendor are handled on backend via auth (token)
    };

    const result = await placeOrder(orderData);

    if (result.success) {
      alert(result.message);
      // navigate("/orders"); // or wherever user sees order history
    } else {
      alert(result.message);
    }
  };

  // Helper to calculate final price with discount
  // const calculateFinalPrice = (price, discount) => {
  //   if (discount && discount > 0 && discount < 100) {
  //     return price - (price * discount) / 100;
  //   }
  //   return price;
  // };

  if (!cart.length) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-4 text-center text-gray-700">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="address" className="block font-semibold mb-1">Shipping Address</label>
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
          <label htmlFor="city" className="block font-semibold mb-1">City</label>
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
          <label htmlFor="country" className="block font-semibold mb-1">Country</label>
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
          <label htmlFor="paymentMethod" className="block font-semibold mb-1">Payment Method</label>
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
          {errors.paymentMethod && <p className="text-red-600 text-sm mt-1">{errors.paymentMethod}</p>}
        </div>

        <div className="mb-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <p>Item Price: ₹{totals.itemPrice.toFixed(2)}</p>
          <p>Tax (18% GST): ₹{totals.tax.toFixed(2)}</p>
          <p>Shipping Charges: ₹{totals.shippingCharges.toFixed(2)}</p>
          <p className="text-lg font-bold mt-2">Total: ₹{totals.totalAmount.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded w-full transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
