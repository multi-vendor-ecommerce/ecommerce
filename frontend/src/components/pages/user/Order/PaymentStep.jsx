import React, { useState, useContext } from "react";
import PaymentContext from "../../../../context/paymentContext/PaymentContext";
import { useNavigate } from "react-router-dom";

const PaymentStep = ({ orderId, onBack }) => {
  const { confirmCOD, createRazorpayOrder, confirmRazorpayPayment } = useContext(PaymentContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        const res = await confirmCOD(orderId);
        alert(`Message: ${res.message }\nOrderId: ${orderId}` || "COD confirmed");
        // if (res.success) navigate(`/order-success/${orderId}`);
        if (res.success) console.log("Navigate kra lo order-success page pe: ", orderId);
        else alert("Error: ", res.message);
      } else if (paymentMethod === "Online") {
        // Step 1: Create Razorpay order
        const razorpayData = await createRazorpayOrder(orderId);
        if (!razorpayData) throw new Error("Failed to create Razorpay order");

        const { razorpayOrder, key } = razorpayData;

        // Step 2: Open Razorpay checkout
        const options = {
          key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          order_id: razorpayOrder.id,
          name: "NoahPlanet",
          description: `Payment for Order #${orderId} on NoahPlanet e-commerce`,
          prefill: {
            contact: "", // optional: fetch from shippingInfo
            email: "",
          },
          handler: async function (response) {
            // Step 3: Confirm payment with backend
            const paymentRes = await confirmRazorpayPayment(orderId, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            // if (paymentRes.success) navigate(`/order-success/${orderId}`);
            if (paymentRes.success) console.log("/ordersuccess page pe navigate krao with orderId", orderId);
            else alert(paymentRes.message);
          },
          theme: { color: "#7e22ce" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Payment</h2>

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="COD">Cash on Delivery</option>
        <option value="Online">Online Payment</option>
      </select>

      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 border rounded" onClick={onBack} disabled={loading}>
          Back
        </button>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
