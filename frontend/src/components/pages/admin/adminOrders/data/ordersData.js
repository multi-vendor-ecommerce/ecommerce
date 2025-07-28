import { FaMoneyBillWave, FaCreditCard, FaShippingFast, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { getFormatDate } from "../../../../../utils/formatDate";

// ——— filter options ——————————————————————————
export const orderFilterFields = [
  {
    name: "search",
    label: "Search by customer or vendor",
    type: "text"
  },
  {
    name: "status",
    label: "Order Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "pending", label: "Pending" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "cancelled", label: "Cancelled" }
    ]
  },
  {
    name: "date",
    label: "Order Date",
    type: "date"
  }
];

export const getOrderCardData = (order) => [
  {
    icon: FaMoneyBillWave,
    label: "Total Amount",
    value: `₹${order.totalAmount?.toLocaleString()}`,
    bg: "bg-green-100",
    shadow: "hover:shadow-green-500",
  },
  {
    icon: FaCreditCard,
    label: "Payment Method",
    value: order.paymentMethod,
    bg: "bg-yellow-100",
    shadow: "hover:shadow-yellow-500",
  },
  {
    icon: FaShippingFast,
    label: "Status",
    value: order.status,
    bg: "bg-purple-100",
    shadow: "hover:shadow-purple-500",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Shipping Address",
    value: order.shippingAddress,
    bg: "bg-blue-100",
    shadow: "hover:shadow-blue-500",
  },
  {
    icon: FaClock,
    label: "Ordered At",
    value: getFormatDate(order.createdAt),
    bg: "bg-pink-100",
    shadow: "hover:shadow-pink-500",
  },
];

