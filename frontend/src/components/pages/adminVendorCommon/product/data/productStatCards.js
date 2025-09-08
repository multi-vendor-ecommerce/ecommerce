import {
  FaBoxOpen,
  FaTag,
  FaMoneyBillWave,
  FaWarehouse,
  FaStore,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toTitleCase } from "../../../../../utils/titleCase";
import { formatNumber } from "../../../../../utils/formatNumber";

export const getProfileCardData = (product) => [
  {
    icon: FaStore,
    label: "Product",
    value: toTitleCase(product.title) || "Unknown",
    bg: "bg-blue-100",
    shadow: "hover:shadow-blue-500",
  },
  {
    icon: FaTag,
    label: "Price",
    value: `₹${formatNumber(product.price ?? 0)}`,
    bg: "bg-yellow-100",
    shadow: "hover:shadow-yellow-500",
  },
  {
    icon: FaBoxOpen,
    label: "Stock",
    value: formatNumber(product.stock ?? 0),
    bg: "bg-pink-100",
    shadow: "hover:shadow-pink-500",
  },
  {
    icon: product.status === "approved" ? FaCheckCircle : FaTimesCircle,
    label: "Status",
    value: toTitleCase(product.status) || "N/A",
    bg: "bg-red-100",
    shadow: "hover:shadow-red-500",
  },
  {
    icon: FaWarehouse,
    label: "Units Sold",
    value: formatNumber(product.unitsSold ?? 0),
    bg: "bg-purple-100",
    shadow: "hover:shadow-purple-500",
  },
  {
    icon: FaMoneyBillWave,
    label: "Revenue",
    value: `₹${formatNumber((product.unitsSold ?? 0) * (product.price ?? 0))}`,
    bg: "bg-green-100",
    shadow: "hover:shadow-green-500",
  },
  {
    icon: FaTag,
    label: "Category",
    value: toTitleCase(product.category?.name) || "N/A",
    bg: "bg-orange-100",
    shadow: "hover:shadow-orange-500",
  },
];