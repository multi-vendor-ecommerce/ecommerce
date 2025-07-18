import { FaRupeeSign, FaUser, FaBoxOpen } from "react-icons/fa";
import { BiCart } from "react-icons/bi";

export const dateFilterFields = [
  {
    name: "date",
    label: "Filter by Date",
    type: "select",
    options: [
      { value: "", label: "All Dates" },
      { value: "today", label: "Today" },
      { value: "yesterday", label: "Yesterday" },
      { value: "this_week", label: "This Week" },
      { value: "this_month", label: "This Month" },
      { value: "quarterly", label: "Quarterly" },
      { value: "yearly", label: "Yearly" },
      { value: "custom", label: "Custom Date" },
    ],
  },
];

export const cards = [
  {
    label: "Revenue",
    value: "145K",
    bgColor: "bg-green-100",
    shadowColor: "hover:shadow-green-500",
    icon: FaRupeeSign,
  },
  {
    label: "Orders",
    value: 932,
    bgColor: "bg-pink-200",
    shadowColor: "hover:shadow-pink-500",
    icon: BiCart,
  },
  {
    label: "Customers",
    value: 1583,
    bgColor: "bg-purple-100",
    shadowColor: "hover:shadow-purple-500",
    icon: FaUser,
  },
  {
    label: "Products",
    value: 264,
    bgColor: "bg-yellow-100",
    shadowColor: "hover:shadow-yellow-500",
    icon: FaBoxOpen,
  },
];
