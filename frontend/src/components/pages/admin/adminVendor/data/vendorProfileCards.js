import {
  FaUser,
  FaStore,
  FaEnvelope,
  FaBoxOpen,
  FaMoneyBillWave,
  FaCoins,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { formatNumber } from "../../../../../utils/formatNumber";
import { toTitleCase } from "../../../../../utils/titleCase";

export const getVendorCardData = (vendor) => [
  {
    icon: FaUser,
    label: "Name",
    value: toTitleCase(vendor.name) || "N/A",
    title: toTitleCase(vendor.name) || "Vendor name not available",
    bg: "bg-gray-200",
    shadow: "hover:shadow-gray-500",
  },
  {
    icon: FaStore,
    label: "Shop",
    value: toTitleCase(vendor.shopName) || "N/A",
    title: toTitleCase(vendor.shopName) || "Vendor shop name not available",
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
    value: toTitleCase(vendor.status) || "Unknown",
    title: toTitleCase(vendor.status) || "Status not available",
    bg: "bg-blue-100",
    shadow: "hover:shadow-blue-500",
  },
  {
    icon: FaBoxOpen,
    label: "Products",
    value: formatNumber(vendor.productQuantity ?? 0),
    title: `${formatNumber(vendor.productQuantity ?? 0)} products`,
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
