import { FaMoneyBillWave, FaCreditCard, FaShippingFast, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { formatNumber } from "../../../../../utils/formatNumber";
import { getFormatDate } from "../../../../../utils/formatDate";
import { shortFormatAddress } from "../../../../../utils/formatAddress";
import { capitalize } from "../../../../../utils/capitalize";

// ——— filter options ——————————————————————————
export const orderFilterFields = [
  {
    name: "search",
    label: "Search by payment method",
    type: "text"
  },
  {
    name: "status",
    label: "Order Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "pending", label: "Pending" },
      { value: "processing", label: "Processing" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "cancelled", label: "Cancelled" }
      
    ]
  },
  {
    name: "date",
    label: "Order Date",
    type: "date",
    max: new Date().toISOString().split("T")[0],
  }
];

export const getOrderCardData = (order) => [
  {
    icon: FaMoneyBillWave,
    label: "Total Amount",
    value: `₹${formatNumber(order.totalAmount)}`,
    bg: "bg-green-100",
    shadow: "hover:shadow-green-500",
  },
  {
    icon: FaCreditCard,
    label: "Payment Method",
    value: order.paymentMethod || "Unknown",
    bg: "bg-yellow-100",
    shadow: "hover:shadow-yellow-500",
  },
  {
    icon: FaShippingFast,
    label: "Status",
    value: capitalize(order.orderStatus) || "Unknown",
    bg: "bg-purple-100",
    shadow: "hover:shadow-purple-500",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Shipping Address",
    value: shortFormatAddress(order.user?.address),
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

