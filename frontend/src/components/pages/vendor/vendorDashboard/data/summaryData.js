import { FaRupeeSign, FaUser, FaChartLine, FaPercentage } from "react-icons/fa";

export const getCards = ({ totalSales, avgOrderValue, commissionEarned, totalCustomers }) => [
  {
    label: "Total Sales",
    value: `₹${totalSales?.toLocaleString() || 0}`,
    bgColor: "bg-green-100",
    shadowColor: "hover:shadow-green-500",
    icon: FaChartLine,
  },
  {
    label: "Avg Order Value",
    value: `₹${avgOrderValue?.toFixed(2) || 0}`,
    bgColor: "bg-blue-100",
    shadowColor: "hover:shadow-blue-500",
    icon: FaRupeeSign,
  },
  {
    label: "Commission Earned",
    value: `₹${commissionEarned?.toLocaleString() || 0}`,
    bgColor: "bg-yellow-100",
    shadowColor: "hover:shadow-yellow-500",
    icon: FaPercentage,
  },
  {
    label: "Customers",
    value: totalCustomers || 0,
    bgColor: "bg-purple-100",
    shadowColor: "hover:shadow-purple-500",
    icon: FaUser,
  },
];

