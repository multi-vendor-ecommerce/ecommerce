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

const OrderSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getUserDraftOrderById } = useContext(OrderContext);
  const { confirmCOD, createRazorpayOrder, confirmRazorpayPayment } = useContext(PaymentContext);

  const [order, setOrder] = useState(null);
  const [step, setStep] = useState(1);
  const [modeOfPayment, setModeOfPayment] = useState("COD");
  const [loading, setLoading] = useState(false);

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

  // Payment handler
  // const handlePayment = async (e) => {
  //   e.preventDefault();
  //   if (!order) return;
  //   setLoading(true);
  //   try {
  //     if (modeOfPayment === "COD") {
  //       const res = await confirmCOD(order._id, order.shippingInfo);
  //       alert("Thankyou! your placed successfully");
  //       if (res.success) navigate(`/my-orders`);
  //       else alert(res.message);
  //     } else {
  //       const razorpayData = await createRazorpayOrder(order._id);
  //       if (!razorpayData) throw new Error("Failed to create Razorpay order");

  //       const { razorpayOrder, key } = razorpayData;
  //       const options = {
  //         key,
  //         amount: razorpayOrder.amount,
  //         currency: razorpayOrder.currency,
  //         order_id: razorpayOrder.id,
  //         name: "NoahPlanet",
  //         description: `Payment for Order #${order._id}`,
  //         handler: async function (response) {
  //           const paymentRes = await confirmRazorpayPayment(order._id, {
  //             razorpayPaymentId: response.razorpay_payment_id,
  //             razorpayOrderId: response.razorpay_order_id,
  //             razorpaySignature: response.razorpay_signature,
  //             shippingInfo: order.shippingInfo,
  //           });
  //           alert("Thankyou! your placed successfully");
  //           if (paymentRes.success) navigate(`/my-orders`);
  //           else alert(paymentRes.message);
  //         },
  //         theme: { color: "#22ce56ff" },
  //       };

  //       if (window.Razorpay) {
  //         new window.Razorpay(options).open();
  //       } else {
  //         const script = document.createElement("script");
  //         script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //         script.onload = () => {
  //           new window.Razorpay(options).open();
  //         };
  //         document.body.appendChild(script);
  //       }
  //     }
  //   } catch (err) {
  //     alert(err.message || "Payment failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    </div>
  );
};

export default OrderSummary;
