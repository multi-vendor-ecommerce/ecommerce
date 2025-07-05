import { StatCard } from "../helperComponents/StatCard";
import { FaUserTie, FaUsers, FaTrophy, FaRupeeSign } from "react-icons/fa";

const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

const CommissionKeyMetrics = ({ heading, stats }) => {
  return (
    <div>
      {/* Top Stats */}
      <h2 className={`text-lg md:text-xl font-semibold text-gray-700 mb-4 ${!heading ? "hidden" : "inline-block"}`}>{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FaRupeeSign}
          label="Total Commission"
          value={`${formatNumber(stats.totalCommission)}`}
          bg="bg-green-100"
          shadow="shadow-green-500"
        />
        <StatCard
          icon={FaUserTie}
          label="Vendor Sales"
          value={`${formatNumber(stats.totalSales)}`}
          bg="bg-yellow-100"
          shadow="shadow-yellow-500"
        />
        <StatCard
          icon={FaTrophy}
          label="Top Vendor"
          value={stats.topVendor.name}
          bg="bg-blue-100"
          shadow="shadow-blue-500"
        />
        <StatCard
          icon={FaUsers}
          label="Active Vendors"
          value={stats.activeVendors}
          bg="bg-purple-100"
          shadow="shadow-purple-500"
        />
      </div>
    </div>
  )
}

export default CommissionKeyMetrics;