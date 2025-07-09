// components/admin/vendor/pages/ShopOverview.jsx
import { useParams, NavLink } from "react-router-dom";
import { dummyVendors } from "./data/dummyVendorsData";
import { ordersDummy } from "../adminOrders/data/ordersData";
import TabularData from "../../../common/layout/TabularData";
import { FaStore, FaBoxOpen, FaEnvelope, FaMoneyBillWave, FaCoins, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo } from "react";
import StatusChip from "../helperComponents/StatusChip";
import { formatNumber } from "../../../../utils/formatNumber";
import { RenderOrderRow } from "../adminOrders/RenderOrderRow";
import StatGrid from "../helperComponents/StatGrid";

const ShopOverview = () => {
  const { shopName } = useParams();
  const vendor = dummyVendors.find((v) => v.shopName === shopName);
  const getVendorCardData = [
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
      value:
        vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1),
      bg: "bg-blue-100",
      shadow: "hover:shadow-blue-500",
    },
    {
      icon: FaBoxOpen,
      label: "Products",
      value: vendor.products,
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
      value: `₹${formatNumber(vendor.commission)}`,
      bg: "bg-red-100",
      shadow: "hover:shadow-red-500"
    }
  ];

  // ‑‑ safeguard ‑‑
  if (!vendor) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Vendor with shop name "{shopName}" not found.
      </div>
    );
  }

  /* ── filter recent orders for this vendor ───────────────── */
  const vendorOrders = ordersDummy
    .filter((o) => o.vendor?.name === vendor.shopName)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  /* Last 6 orders for table */
  const recentOrders = vendorOrders.slice(0, 6);

  /* Build monthly totals for chart (last 6 months) */
  const monthlyData = useMemo(() => {
    const map = {};
    vendorOrders.forEach((o) => {
      const d = new Date(o.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`; // e.g., 2025-6
      map[key] = (map[key] || 0) + o.products.reduce((sum, p) => sum + p.price * p.qty, 0);
    });
    return Object.entries(map)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-6)
      .map(([k, v]) => ({ month: k, Sales: v }));
  }, [vendorOrders]);

  return (
    <section className="p-6 w-full bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{vendor.shopName} - Overview</h2>
        <NavLink
          to={`/admin/vendor/edit-delete/${vendor.id}`}
          className="flex items-center gap-2 px-3 md:px-6 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
        >
          <FiEdit size={20} />
          <span className="hidden md:inline-block">Edit Vendor</span>
        </NavLink>
      </div>

      {/* Stats Grid */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-blue-500 transition duration-300 px-4 py-6 mb-8">
        <StatGrid cards={getVendorCardData} />
      </div>

      {/* Bar Chart */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales (Last 6 Months)</h3>
      <div className="bg-white rounded-xl shadow-md hover:shadow-blue-500 transition duration-300 border border-gray-200 p-4 mb-10">
        {monthlyData.length ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No sales data available.</p>
        )}
      </div>

      {/* Recent Orders Table */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
      <div className="overflow-hidden bg-white shadow-md hover:shadow-blue-500 transition duration-200 rounded-xl border border-gray-200">
        <TabularData
          headers={["Order ID", "Customer", "Date", "Total", "Status", "Actions"]}
          data={recentOrders}
          renderRow={(o, i) => RenderOrderRow(o, i, StatusChip)}
          emptyMessage="No orders found."
          widthClass="w-full"
        />
      </div>
    </section>
  );
};

export default ShopOverview;
