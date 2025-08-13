import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderContext from "../../../../context/orders/OrderContext";
import PersonContext from "../../../../context/person/PersonContext.jsx";
import { calculateCheckoutTotals } from "../Utils/cartHelpers.js";
import { getFinalPrice } from "../Utils/priceUtils.js";
import CustomSelect from "../../../common/layout/CustomSelect.jsx";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];

  const { placeOrder, loading } = useContext(OrderContext);
  const { getCurrentPerson, person } = useContext(PersonContext);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        await getCurrentPerson();
      } catch (error) {
        console.error("Error fetching person:", error);
      }
    };

    fetchPerson();
  }, []);

  const totals = calculateCheckoutTotals(cart);

  // const handlePaymentChange = (e) => {
  //   setPaymentMethod(e.target.value);
  // };

  const paymentOptions = [
    { value: "COD", label: "Cash On Delivery (COD)" },
    { value: "Online", label: "Online Payment" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!person?.address?.line1?.trim()) newErrors.address = "Shipping address is missing";
    if (!person?.address?.city?.trim()) newErrors.city = "City is missing";
    if (!person?.address?.country?.trim()) newErrors.country = "Country is missing";
    if (!paymentMethod) newErrors.paymentMethod = "Payment method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    const orderData = {
      shippingInfo: {
        line1: person.address.line1,
        line2: person.address.line2,
        city: person.address.city,
        state: person.address.state,
        country: person.address.country,
        pincode: person.address.pincode,
        recipientName: person.address.recipientName || person.name,
        recipientPhone: person.address.recipientPhone || person.phone,
        geoLocation: person.address.geoLocation || {},
      },
      orderItems,
      paymentMethod,
      itemPrice: totals.itemPrice,
      tax: totals.tax,
      shippingCharges: totals.shippingCharges,
      totalAmount: totals.totalAmount,
    };

    const result = await placeOrder(orderData);

    if (result.success) {
      alert(result.message);
      // Optionally navigate to orders page:
      // navigate("/orders");
    } else {
      alert(result.message);
    }
  };

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

  if (!person) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-4 text-center text-gray-700">
        <h2>Loading your profile...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Shipping Address</label>
          {person && person.address ? (
            <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
              <p>{person.address.line1}</p>
              {person.address.line2 && <p>{person.address.line2}</p>}
              <p>
                {person.address.city}, {person.address.state} - {person.address.pincode}
              </p>
              <p>{person.address.country}</p>
              {(person.address.recipientName || person.name) && (
                <p>
                  Recipient: {person.address.recipientName || person.name}
                </p>
              )}
              {(person.address.recipientPhone || person.phone) && (
                <p>
                  Phone: {person.address.recipientPhone || person.phone}
                </p>
              )}
            </div>
          ) : (
            <p>No address available</p>
          )}

          {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
          {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
          <button
            type="button"
            onClick={() => alert("Edit shipping address feature coming soon!")}
            className="mt-2 text-purple-700 underline hover:text-purple-900"
          >
            Edit Shipping Address
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="paymentMethod" className="block font-semibold mb-1">
            Payment Method
          </label>
          <CustomSelect
            options={paymentOptions}
            value={paymentMethod}
            onChange={(val) => setPaymentMethod(val)}
            menuPlacement="auto"
          />
          {errors.paymentMethod && (
            <p className="text-red-600 text-sm mt-1">{errors.paymentMethod}</p>
          )}
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
          className={`bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded w-full transition ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
