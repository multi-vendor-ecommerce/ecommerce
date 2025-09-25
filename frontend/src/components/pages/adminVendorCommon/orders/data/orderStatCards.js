import { FaMoneyBillWave, FaCreditCard, FaShippingFast, FaClock, FaShoppingBag } from "react-icons/fa";
import { formatNumber } from "../../../../../utils/formatNumber";
import { getFormatDate } from "../../../../../utils/formatDate";
import { capitalize } from "../../../../../utils/capitalize";
import { toTitleCase } from "../../../../../utils/titleCase";

export const getOrderCardData = (order) => [
  {
    icon: FaMoneyBillWave,
    label: "Total Amount",
    value: `₹${formatNumber(order.grandTotal)}`,
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
    icon: FaShoppingBag,
    label: "Source",
    value: toTitleCase(order?.source) || "N/A",
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

