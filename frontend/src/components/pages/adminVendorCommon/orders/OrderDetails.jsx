import { NavLink, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MdEmail, MdPhone } from "react-icons/md";
import OrderContext from "../../../../context/orders/OrderContext";
import Loader from "../../../common/Loader";
import BackButton from "../../../common/layout/BackButton";
import { getOrderCardData } from "./data/orderStatCards";
import StatGrid from "../../../common/helperComponents/StatGrid";
import { formatAddress } from "../../../../utils/formatAddress";
import { toTitleCase } from "../../../../utils/titleCase";
import { formatNumber } from "../../../../utils/formatNumber";
import { FiEye } from "react-icons/fi";
import { getOrderTotalsData } from "./data/orderInfoData";

const OrderDetails = ({ role = "admin" }) => {
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
  }, [orderId]);

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
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
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
          Order #{order._id}
        </h2>
      </div>

      {/* Payment & Status */}
      <div className="bg-white p-6 mt-8 rounded-2xl shadow-md border border-gray-200 hover:shadow-blue-500 transition duration-300 mb-8">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 pb-2">Order Summary</h3>
        <div className="w-full h-full">
          <StatGrid cards={getOrderCardData(order)} />
        </div>
      </div>

      {/* Products */}
      <div className="w-full bg-white rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 mb-8 p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 truncate">Products</h3>
          {role === "vendor" && (
            <a
              href={order.vendorInvoices?.[0]?.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 items-center px-2 md:px-4 py-2 rounded-xl text-center text-sm md:text-[16px] font-medium text-blue-500 border-2 border-blue-500 transition hover:bg-blue-500 hover:text-white cursor-pointer"
            >
              <FiEye size={20} />
              View Invoice
            </a>
          )}
        </div>

        {order.orderItems?.map(item => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-50 rounded-lg p-4 border-[0.5px] border-gray-50 shadow-sm hover:shadow-purple-500 transition duration-150"
          >
            <div>
              <p className="font-semibold text-gray-800">{toTitleCase(item.product?.title) || "No Product Title"}</p>
              <p className="text-sm text-gray-500">Qty: {item?.quantity}</p>
            </div>

            <div className="text-right">
              <p className="text-gray-700 font-medium">
                ₹{formatNumber(item?.originalPrice ?? 0)} x {formatNumber(item?.quantity)}
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                Total: ₹{formatNumber((item?.originalPrice ?? 0) * item?.quantity)}
              </p>
            </div>
          </div>
        ))}

        <div className="flex flex-col md:flex-row items-end justify-between md:items-center gap-1 border-t border-dashed border-gray-300 pt-4 mt-4 text-sm text-gray-600">
          <div className="text-right md:text-left space-y-1">
            {getOrderTotalsData(order).left.map((item, idx) => (
              <p key={idx} className={item?.className || ""}>
                <span className="font-medium">{item.label}</span> {item.value}
              </p>
            ))}
          </div>

          <div className="text-right space-y-1">
            {getOrderTotalsData(order).right.map((item, idx) => (
              <p key={idx} className={item.className}>
                <span className="font-medium">{item.label}</span> {item.value}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Order Shipping Info */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 space-y-1.5">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Shipping Info</h3>
          <p>
            <span className="font-semibold">Shipping Address:</span> {formatAddress(order?.shippingInfo)}
          </p>
          <p>
            <span className="font-semibold">Invoice Number:</span> {order?.invoiceNumber || "N/A"}
          </p>

          {role === "admin" && (
            <div className="flex flex-col md:flex-row gap-1 justify-between items-center space-y-1 mt-4">
              <a
                href={order?.userInvoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center px-2 md:px-4 py-2 rounded-xl text-center text-sm md:text-[16px] font-medium text-blue-500 border-2 border-blue-500 transition hover:bg-blue-500 hover:text-white cursor-pointer"
              >
                <FiEye size={20} />
                Customer Invoice
              </a>

              <NavLink
                to={`/admin/${order?._id}/vendor-invoices`}
                className="flex gap-2 items-center px-2 md:px-4 py-2 rounded-xl text-center text-sm md:text-[16px] font-medium text-green-600 border-2 border-green-600 transition hover:bg-green-600 hover:text-white cursor-pointer"
              >
                <FiEye size={20} />
                Vendor Invoices
              </NavLink>
            </div>
          )}
        </div>
      </div>

      <div className={`grid ${role === "vendor" ? "grid-cols-1" : "md:grid-cols-2"} gap-6`}>
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 space-y-1.5">
          <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Customer Info</h3>
          <p><span className="font-semibold">Name:</span> {toTitleCase(order.user?.name)}</p>
          <p><span className="font-semibold">Location:</span> {formatAddress(order.user?.address)}</p>
          <p className="flex items-center gap-2 text-blue-600"><MdEmail /> {order.user?.email}</p>
          {order.user?.phone && (
            <p className="flex items-center gap-2 text-gray-600"><MdPhone /> +91 {order.user.phone}</p>
          )}
        </div>

        {/* Vendor Info (Only for Admin) */}
        {role !== "vendor" && (
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 space-y-1.5">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Vendor Info</h3>
            <p>
              <span className="font-semibold">Shop:</span> {toTitleCase(order.orderItems?.[0]?.product?.createdBy?.shopName) || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Vendor:</span> {toTitleCase(order.orderItems?.[0]?.product?.createdBy?.name) || "N/A"}
            </p>
            <p className="flex items-center gap-2 text-blue-600">
              <MdEmail /> {order.orderItems?.[0]?.product?.createdBy?.email || "N/A"}
            </p>
            {order.orderItems?.[0]?.product?.createdBy?.phone && (
              <p className="flex items-center gap-2 text-gray-600">
                <MdPhone /> +91 {order.orderItems?.[0]?.product?.createdBy?.phone}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderDetails;
