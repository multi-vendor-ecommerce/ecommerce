import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MdEmail, MdPhone } from "react-icons/md";
import OrderContext from "../../../../context/orders/OrderContext";
import Spinner from "../../../common/Spinner";
import BackButton from "../../../common/layout/BackButton";
import { getFormatDate } from "../../../../utils/formatDate";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { getOrderById } = useContext(OrderContext);
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

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center bg-gray-100 text-gray-600 text-lg md:text-3xl font-medium md:font-bold">
        Order not found.
      </div>
    );
  }

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center gap-5 mb-6">
        <BackButton />
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">Order #{order._id}</h2>
      </div>

      <div className="w-full bg-white rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 mb-8 p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Products</h3>
        {order.products.map((item, idx) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.product.title}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 font-medium">
                ₹{item.priceAtPurchase} x {item.quantity}
              </p>
              <p className="text-xs text-gray-500">
                Total: ₹{item.priceAtPurchase * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Customer Info</h3>
          <p><span className="font-semibold">Name:</span> {order.user.name}</p>
          <p><span className="font-semibold">Location:</span> {order.user.address}</p>
          <p className="flex items-center gap-2 text-blue-600"><MdEmail /> {order.user.email}</p>
          {order.user.phone && (
            <p className="flex items-center gap-2 text-gray-600"><MdPhone /> {order.user.phone}</p>
          )}
        </div>

        {/* Vendor Info */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Vendor Info</h3>
          <p><span className="font-semibold">Shop:</span> {order.vendor.shopName}</p>
          <p><span className="font-semibold">Vendor:</span> {order.vendor.name}</p>
          <p className="flex items-center gap-2 text-blue-600"><MdEmail /> {order.vendor.email}</p>
          {order.vendor.phone && (
            <p className="flex items-center gap-2 text-gray-600"><MdPhone /> {order.vendor.phone}</p>
          )}
        </div>
      </div>

      {/* Payment & Status */}
      <div className="bg-white p-6 mt-8 rounded-2xl shadow-md border border-gray-200 hover:shadow-blue-500 transition duration-300">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-blue-100">Order Summary</h3>

        <div className="space-y-3 text-gray-700 text-base leading-relaxed">
          <p>
            <span className="font-semibold text-gray-900">Total Amount:</span>
            <span className="ml-2 text-blue-600 font-semibold">₹{order.totalAmount}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-900">Payment Method:</span>
            <span className="ml-2 capitalize">{order.paymentMethod}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-900">Status:</span>
            <span className={`ml-2 font-semibold ${order.status === "shipped" ? "text-green-600" : "text-yellow-500"}`}>
              {order.status}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-900">Shipping Address:</span>
            <span className="ml-2">{order.shippingAddress}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-900">Ordered At:</span>
            <span className="ml-2">{getFormatDate(order.createdAt)}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
