import { FaUserTie, FaUsers, FaTrophy, FaRupeeSign } from "react-icons/fa";
import { formatNumber } from "../../../../utils/formatNumber";
import StatGrid from "../helperComponents/StatGrid";

const CommissionKeyMetrics = ({ stats }) => {
  const cardsData = [
    {
      icon: FaRupeeSign,
      label: "Total Commission",
      value: `${formatNumber(stats.totalCommission || 0)}`,
      bg: "bg-green-100",
      shadow: "hover:shadow-green-500",
    },
    {
      icon: FaUserTie,
      label: "Vendor Sales",
      value: `${formatNumber(stats.totalSales || 0) }`,
      bg: "bg-yellow-100",
      shadow: "hover:shadow-yellow-500",
    },
    {
      icon: FaTrophy,
      label: "Top Vendor",
      value: stats.topVendor.name,
      bg: "bg-blue-100",
      shadow: "hover:shadow-blue-500",
    },
    {
      icon: FaUsers,
      label: "Active Vendors",
      value: stats.activeVendors,
      bg: "bg-purple-100",
      shadow: "hover:shadow-purple-500",
    },
  ];

  return (
      <StatGrid cards={cardsData} />
  )
}

export default CommissionKeyMetrics;