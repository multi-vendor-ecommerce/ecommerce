import {
  FaBoxOpen,
  FaTag,
  FaMoneyBillWave,
  FaWarehouse,
  FaStore,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { capitalize } from "../../../../../utils/capitalize";

export const getProfileCardData = (product) => [
  {
    icon: FaTag,
    label: "Price",
    value: `₹${product.price ? (product.price).toLocaleString() : "N/A"}`,
    bg: "bg-yellow-100",
    shadow: "hover:shadow-yellow-500",
  },
  {
    icon: FaBoxOpen,
    label: "Stock",
    value: product.stock ? product.stock : "N/A",
    bg: "bg-pink-100",
    shadow: "hover:shadow-pink-500",
  },
  {
    icon: product.status === "approved" ? FaCheckCircle : FaTimesCircle,
    label: "Status",
    value: capitalize(product.status) || "N/A",
    bg: "bg-red-100",
    shadow: "hover:shadow-red-500",
  },
  {
    icon: FaWarehouse,
    label: "Units Sold",
    value: product.unitsSold ? product.unitsSold : 0,
    bg: "bg-purple-100",
    shadow: "hover:shadow-purple-500",
  },
  {
    icon: FaMoneyBillWave,
    label: "Revenue",
    value: `₹${(product.unitsSold * product.price).toLocaleString()}`,
    bg: "bg-green-100",
    shadow: "hover:shadow-green-500",
  },
  {
    icon: FaStore,
    label: "Product",
    value: product.title || "Unknown",
    bg: "bg-blue-100",
    shadow: "hover:shadow-blue-500",
  },
  {
    icon: FaTag,
    label: "Category",
    value: product.category?.name || "N/A",
    bg: "bg-orange-100",
    shadow: "hover:shadow-orange-500",
  },
];