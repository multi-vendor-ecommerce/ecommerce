import {
  FaBoxOpen,
  FaTag,
  FaMoneyBillWave,
  FaWarehouse,
  FaStore,
} from "react-icons/fa";

export const getProfileCardData = (product) => [
  {
    icon: FaTag,
    label: "Price",
    value: `₹${product.price ? (product.price).toLocaleString() : "N/A"}`,
    bg: "bg-yellow-100",
  },
  {
    icon: FaBoxOpen,
    label: "Stock",
    value: product.stock ? product.stock : "N/A",
    bg: "bg-pink-100",
  },
  {
    icon: FaWarehouse,
    label: "Units Sold",
    value: product.unitsSold ? product.unitsSold : 0,
    bg: "bg-purple-100",
  },
  {
    icon: FaMoneyBillWave,
    label: "Revenue",
    value: `₹${(product.unitsSold * product.price).toLocaleString()}`,
    bg: "bg-green-100",
  },
  {
    icon: FaStore,
    label: "Product",
    value: product.title || "Unknown",
    bg: "bg-blue-100",
  },
  {
    icon: FaTag,
    label: "Category",
    value: product.category?.name || "N/A",
    bg: "bg-orange-100",
  },
];