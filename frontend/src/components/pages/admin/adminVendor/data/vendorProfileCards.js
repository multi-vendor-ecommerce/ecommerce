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
    value: vendor.name,
    bg: "bg-green-100",
    shadow: "hover:shadow-green-500",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: vendor.email,
    bg: "bg-yellow-100",
    shadow: "hover:shadow-yellow-500",
  },
  {
    icon: vendor.status === "active" ? FaCheckCircle : FaTimesCircle,
    label: "Status",
    value: vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1),
    bg: "bg-blue-100",
    shadow: "hover:shadow-blue-500",
  },
  {
    icon: FaBoxOpen,
    label: "Products",
    value: vendor.productQuantity,
    bg: "bg-purple-100",
    shadow: "hover:shadow-purple-500",
  },
  {
    icon: FaMoneyBillWave,
    label: "Total Sales",
    value: `₹${formatNumber(vendor.totalSales)}`,
    bg: "bg-orange-100",
    shadow: "hover:shadow-orange-500",
  },
  {
    icon: FaCoins,
    label: "Commission",
    value: `₹${formatNumber(vendor.commissionRate)}`,
    bg: "bg-red-100",
    shadow: "hover:shadow-red-500",
  },
];
