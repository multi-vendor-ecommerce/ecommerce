import {
  FaStore,
  FaEnvelope,
  FaBoxOpen,
  FaMoneyBillWave,
  FaCoins,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { formatNumber } from "../../../../../utils/formatNumber";

export const getVendorCardData = (vendor) => [
  {
    icon: FaStore,
    label: "Vendor",
    value: vendor.name || "N/A",
    title: vendor.name || "Vendor name not available",
    bg: "bg-green-100",
    shadow: "hover:shadow-green-500",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: vendor.email || "N/A",
    title: vendor.email || "Email not available",
    bg: "bg-yellow-100",
    shadow: "hover:shadow-yellow-500",
  },
  {
    icon: vendor.status === "active" ? FaCheckCircle : FaTimesCircle,
    label: "Status",
    value: vendor.status?.charAt(0).toUpperCase() + vendor.status?.slice(1) || "Unknown",
    title: vendor.status || "Status not available",
    bg: "bg-blue-100",
    shadow: "hover:shadow-blue-500",
  },
  {
    icon: FaBoxOpen,
    label: "Products",
    value: vendor.productQuantity ?? "N/A",
    title: `${vendor.productQuantity ?? "Unknown"} products`,
    bg: "bg-purple-100",
    shadow: "hover:shadow-purple-500",
  },
  {
    icon: FaMoneyBillWave,
    label: "Total Sales",
    value: `₹${formatNumber(vendor.totalSales || 0)}`,
    title: `₹${formatNumber(vendor.totalSales || 0)} in total sales`,
    bg: "bg-orange-100",
    shadow: "hover:shadow-orange-500",
  },
  {
    icon: FaCoins,
    label: "Commission",
    value: `₹${formatNumber(vendor.commissionRate || 0)}`,
    title: `₹${formatNumber(vendor.commissionRate || 0)} commission`,
    bg: "bg-red-100",
    shadow: "hover:shadow-red-500",
  },
];
