import { toast } from "react-toastify";

export const handlePayment = async ({
  order,
  modeOfPayment,
  confirmCOD,
  createRazorpayOrder,
  confirmRazorpayPayment,
  setLoading,
  onSuccess
}) => {
  if (!order) return;
  setLoading(true);

  try {
    if (modeOfPayment === "COD") {
      const res = await confirmCOD(order._id, order.shippingInfo);
      if (res.success) {
        onSuccess?.();
      } else {
        toast.error(res.message || "Failed to place COD order.");
      }
    } else {
      const razorpayData = await createRazorpayOrder(order._id);
      console.log(razorpayData);

      if (!razorpayData || razorpayData.success === false) {
        toast.error(razorpayData?.message || "Cannot proceed to payment");
        return; 
      }

      const { razorpayOrder, key } = razorpayData;
      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "NoahPlanet",
        description: `Payment for Order #${order._id}`,
        handler: async function (response) {
          const paymentRes = await confirmRazorpayPayment(order._id, {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            shippingInfo: order.shippingInfo,
          });
          if (paymentRes.success) {
            onSuccess?.();
          } else {
            toast.error(paymentRes.message || "Payment failed. Please try again.");
          }
        },
        theme: { color: "#22ce56ff" },
      };

      if (window.Razorpay) {
        new window.Razorpay(options).open();
      } else {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          new window.Razorpay(options).open();
        };
        document.body.appendChild(script);
      }
    }
  } catch (err) {
    toast.error(err.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};
