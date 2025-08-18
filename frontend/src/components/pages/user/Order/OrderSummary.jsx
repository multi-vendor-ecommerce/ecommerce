import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderContext from "../../../../context/orders/OrderContext";
import ShippingStep from "./ShippingStep";
import ReviewStep from "./ReviewStep";
import PaymentStep from "./PaymentStep";

const OrderSummary = () => {
  const { id } = useParams(); // draft order ID
  const navigate = useNavigate();
  const { getUserDraftOrderById } = useContext(OrderContext);

  const [order, setOrder] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchDraft = async () => {
      const data = await getUserDraftOrderById(id);
      if (data) setOrder(data);
      else navigate("/"); // order not found
    };
    fetchDraft();
  }, [id]);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  if (!order) return <p>Loading draft order...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Step Progress */}
      <div className="flex justify-between mb-6">
        {["Shipping", "Review", "Payment"].map((label, i) => (
          <div
            key={i}
            className={`flex-1 text-center py-2 border-b-4 ${
              step === i + 1 ? "border-purple-600 font-bold" : "border-gray-300"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Render Steps */}
      {step === 1 && <ShippingStep order={order} onNext={next} />}
      {step === 2 && <ReviewStep order={order} onNext={next} onBack={prev} />}
      {step === 3 && <PaymentStep order={order} orderId={order._id} onBack={prev} />}
    </div>
  );
};

export default OrderSummary;
