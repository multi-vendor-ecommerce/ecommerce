import { useParams } from "react-router-dom";
import { ordersDummy } from "./data/ordersData";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

const getStatusBadge = (status) => {
  const base = "text-sm px-2 py-1 rounded-full font-semibold inline-flex items-center gap-1";
  switch (status.toLowerCase()) {
    case "delivered":
      return `${base} text-green-700 bg-green-100`;
    case "pending":
      return `${base} text-yellow-700 bg-yellow-100`;
    case "cancelled":
      return `${base} text-red-700 bg-red-100`;
    default:
      return `${base} text-gray-700 bg-gray-100`;
  }
};

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return <FaCheckCircle />;
    case "pending":
      return <FaHourglassHalf />;
    case "cancelled":
      return <FaTimesCircle />;
    default:
      return null;
  }
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const order = ordersDummy.find((o) => o.orderNo === orderId);

  if (!order) {
    return (
      <div className="p-6 text-center bg-gray-100 text-gray-600 text-lg md:text-3xl font-medium md:font-bold">
        Order not found.
      </div>
    );
  }

  return (
    <section className="p-6 md:p-10 min-h-screen bg-gray-100">
      <h1 className="text-xl md:text-2xl font-bold mb-8 text-gray-800">Order Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-500 transition duration-150 space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 pb-2">Product Info</h2>
          <div className="text-gray-800">
            <div className="flex justify-between items-center mb-2">
              <div className="mb-2">
                <span className="font-semibold text-gray-600">Order No:</span> {order.orderNo}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-600">Date:</span> {order.date}
              </div>
            </div>
            {order.products.map((prod, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Placeholder image */}
                  <div className="w-12 h-12 bg-gray-200 rounded" />
                  <div>
                    <p className="font-semibold text-gray-800">{prod.name}</p>
                    <p className="text-xs text-gray-500">ID: {order.orderNo}-{idx + 1}</p>
                  </div>
                </div>
                <div className="text-right">
                  {/* price & qty placeholders */}
                  <p className="font-semibold text-gray-800">₹{prod.price}</p>
                  <p className="text-xs text-gray-500">Qty: {prod.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Vendor Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-500 transition duration-150 space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 pb-2">Customer & Vendor</h2>
          <div className="text-gray-800 flex flex-col items-stretch justify-between gap-5">
            <div>
              <div>
                <span className="text-[16px] md:text-lg font-semibold text-gray-600">Customer: </span>
                <span className="text-[16px] md:text-lg cursor-pointer hover:font-medium hover:text-black transition duration-200">{order.customer.name}</span>
              </div>
              <div className="text-sm md:text-[16px] text-blue-500 mt-1 hover:underline flex gap-3 items-center">
                <span><MdEmail /></span>
                <span>{order.customer.email}</span>
              </div>
              <div className="text-sm md:text-[16px] text-gray-500 mt-2 flex gap-3 items-center">
                <span><MdPhone /></span>
                <span>{order.customer.phone}</span>
              </div>
            </div>

            <div className="mb-2">
              <div className="mb-1">
                <span className="text-[16px] md:text-lg font-semibold text-gray-600">Vendor: </span>
                <span className="text-[16px] md:text-lg cursor-pointer hover:font-medium hover:text-black transition duration-200">{order.vendor.name}</span>
              </div>
              <div className="text-sm md:text-[16px] text-blue-500 hover:underline flex gap-3 items-center">
                <span><MdEmail /></span>
                <span>{order.vendor.email}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Payment & Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-500 transition duration-150 space-y-4 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 pb-2">Payment & Status</h2>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="text-gray-800">
              <span className="font-semibold text-gray-600">Payment:</span> {order.payment}
            </div>
            <div className={getStatusBadge(order.status)}>
              {getStatusIcon(order.status)}
              {order.status}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
