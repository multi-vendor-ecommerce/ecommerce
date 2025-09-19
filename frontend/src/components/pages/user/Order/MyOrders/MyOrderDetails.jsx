import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MdPhone, MdLocationOn, MdCancel } from "react-icons/md";
import OrderContext from "../../../../../context/orders/OrderContext";
import Loader from "../../../../common/Loader";
import BackButton from "../../../../common/layout/BackButton";
import { getOrderCardData } from "../../../adminVendorCommon/orders/data/ordersData";
import StatGrid from "../../../../common/helperComponents/StatGrid";
import { formatAddress } from "../../../../../utils/formatAddress";
import { toast } from "react-toastify";
import StatusChip from "../../../../common/helperComponents/StatusChip";
import Button from "../../../../common/Button";

const MyOrderDetails = () => {
  const { orderId } = useParams();
  const { getOrderById, cancelOrder } = useContext(OrderContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  const handleCancelOrder = async () => {
    const confirm = window.confirm("Are you sure you want to cancel this order?");
    if (!confirm) return;
    const result = await cancelOrder(order._id);
    if (result.success) {
      toast.success( result.message|| "Order cancelled successfully.");
      setOrder((prev) => ({ ...prev, orderStatus: "Cancelled" }));
    } else {
      toast.error(result.message || "Failed to cancel order.");
    }
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center bg-green-50 text-gray-700 text-lg md:text-2xl font-semibold min-h-screen flex items-center justify-center">
        Order not found.
      </div>
    );
  }

  return (
    <section className="p-6 bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-5">
        <BackButton />
        <h2 className="text-2xl font-bold text-green-700">
          Order #{order._id}
        </h2>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg md:text-xl font-semibold text-green-700 mb-4">
          Order Summary
        </h3>
        <StatGrid cards={getOrderCardData(order)} />

        <div className="mt-4 flex justify-between items-center">
          <StatusChip status={order.orderStatus} />
          
          {order.orderStatus !== "cancelled" &&
            order.orderStatus !== "delivered" && (
              <Button
                icon={MdCancel}
                text="Cancel Order"
                onClick={handleCancelOrder}
                className="py-2"
                color="red"
              />
            )}
        </div>
      </div>

      {/* Products */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg md:text-xl font-semibold text-green-700 mb-4">
          Products
        </h3>
        <div className="space-y-4">
          {order.orderItems?.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:shadow-md transition"
            >
              <img
                src={item.product?.images?.[0].url || "/placeholder.png"}
                alt={item.product?.title}
                className="w-20 h-20 object-cover rounded-xl shadow-sm"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {item.product?.title}
                </p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  ₹{item.product?.price} each
                </p>
              </div>
              <div className="text-right font-semibold text-gray-800">
                ₹{(item.product?.price ?? 0) * item.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg md:text-xl font-semibold text-green-700 mb-4">
          Shipping Info
        </h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Name:</span>{" "}
            {order.shippingInfo?.recipientName}
          </p>
          <p className="flex items-center gap-2">
            <MdPhone className="text-green-600" /> +91{" "}
            {order.shippingInfo?.recipientPhone}
          </p>
          <p className="flex items-center gap-2">
            <MdLocationOn className="text-green-600" />{" "}
            {formatAddress(order.shippingInfo)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MyOrderDetails;
