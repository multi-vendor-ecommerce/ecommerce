import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../../common/Spinner";
import Stepper from "../../../common/Stepper";
import ShippingStep from "./ShippingStep";
import ReviewStep from "./ReviewStep";
import PaymentStep from "./PaymentStep";
import OrderContext from "../../../../context/orders/OrderContext";
import PaymentContext from "../../../../context/paymentContext/PaymentContext";
import { handlePayment } from "./orderHelpers/paymentHandler";
import SuccessModal from "./SuccessModal";

const OrderSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getUserDraftOrderById } = useContext(OrderContext);
  const { confirmCOD, createRazorpayOrder, confirmRazorpayPayment } = useContext(PaymentContext);

  const [order, setOrder] = useState(null);
  const [step, setStep] = useState(1);
  const [modeOfPayment, setModeOfPayment] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch draft order
  useEffect(() => {
    const fetchDraft = async () => {
      setLoading(true);
      const data = await getUserDraftOrderById(id);
      if (data) setOrder(data);
      else navigate("/");
      setLoading(false);
    };
    fetchDraft();
  }, [id]);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const onPayment = (e) => {
    e.preventDefault();
    handlePayment({
      order,
      modeOfPayment,
      confirmCOD,
      createRazorpayOrder,
      confirmRazorpayPayment,
      navigate,
      setLoading,
      onSuccess: () => setShowSuccessModal(true),
    });
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <Stepper
        stepLabels={["Shipping", "Review", "Payment"]}
        currentStep={step}
        className="flex justify-between mb-6"
      />

      {step === 1 && (
        <ShippingStep
          order={order}
          setOrder={setOrder}
          step={step}
          next={next}
          prev={prev}
        />
      )}
      {step === 2 && (
        <ReviewStep
          order={order}
          step={step}
          next={next}
          prev={prev}
        />
      )}
      {step === 3 && (
        <PaymentStep
          orderId={order._id}
          modeOfPayment={modeOfPayment}
          setModeOfPayment={setModeOfPayment}
          handlePayment={onPayment}
          step={step}
          next={next}
          prev={prev}
          loading={loading}
        />
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/my-orders");
        }}
        message="Your order has been placed successfully!"
      />
    </div>
  );
};

export default OrderSummary;
