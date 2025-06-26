import { useParams } from "react-router-dom";
import { ordersDummy } from "./data/ordersData";

// React Icons
import { FaBarcode, FaCalendarAlt, FaBoxOpen, FaUser, FaStore, FaMoneyBill, FaInfoCircle } from "react-icons/fa";

const fieldMap = {
  orderNo: { label: "Order Number", icon: <FaBarcode /> },
  date: { label: "Order Date", icon: <FaCalendarAlt /> },
  product: { label: "Product", icon: <FaBoxOpen /> },
  customer: { label: "Customer", icon: <FaUser /> },
  vendor: { label: "Vendor", icon: <FaStore /> },
  payment: { label: "Payment", icon: <FaMoneyBill /> },
  status: { label: "Status", icon: <FaInfoCircle /> },
};

const getStatusBadge = (status) => {
  const map = {
    delivered: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status.toLowerCase()] || "bg-gray-100 text-gray-700";
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const order = ordersDummy.find((o) => o.orderNo === orderId);

  if (!order) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg font-medium">
        Order not found.
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6"> Order Details</h2>

      <div className="bg-white rounded-3xl shadow-lg w-[90%] p-8 md:text-lg shadow-blue-500 transition duration-150">
        <div className="grid gap-5">
        {Object.entries(fieldMap).map(([key, { label, icon }]) => (
          <div
            key={key}
            className="flex items-center justify-between pb-3"
          >
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              {icon}
              {label}
            </div>
            {key === "status" ? (
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                  order[key]
                )}`}
              >
                {order[key]}
              </span>
            ) : (
              <span className="text-gray-800 font-semibold">{order[key]}</span>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default OrderDetails;
