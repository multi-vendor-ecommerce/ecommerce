// components/admin/vendor/pages/VendorProfile.jsx
import { useParams, NavLink } from "react-router-dom";
import { useContext, useState, useEffect, useMemo } from "react";
import VendorContext from "../../../../context/vendors/VendorContext";
import { ordersDummy } from "../adminOrders/data/ordersData";
import TabularData from "../../../common/layout/TabularData";
import { FiEdit } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import StatusChip from "../../../common/helperComponents/StatusChip";
import { getVendorCardData } from "./data/vendorProfileCards";
import { RenderOrderRow } from "../adminOrders/RenderOrderRow";
import StatGrid from "../../../common/helperComponents/StatGrid";
import { getFormatDate } from "../../../../utils/formatDate";
import Spinner from "../../../common/Spinner";
import BackButton from "../../../common/layout/BackButton";

const VendorProfile = () => {
  const { vendorId } = useParams();
  const { getVendorById, loading } = useContext(VendorContext);
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      const result = await getVendorById(vendorId);
      setVendor(result);
    };

    fetchVendor();
  }, [vendorId, getVendorById]);

  const vendorOrders = useMemo(() => {
    if (!vendor) return [];
    return ordersDummy
      .filter((o) => o.vendor?.name === vendor.shopName)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [vendor]);

  const recentOrders = useMemo(() => vendorOrders.slice(0, 6), [vendorOrders]);

  const monthlyData = useMemo(() => {
    if (!vendorOrders.length) return [];

    const map = {};
    vendorOrders.forEach((o) => {
      const d = new Date(o.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      map[key] = (map[key] || 0) + o.products.reduce((sum, p) => sum + p.price * p.qty, 0);
    });

    return Object.entries(map)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-6)
      .map(([k, v]) => {
        const [year, month] = k.split("-");
        const formattedMonth = getFormatDate(`${year}-${month}-01`).split(" ").slice(1).join(" ");
        return { month: formattedMonth, Sales: v };
      });
  }, [vendorOrders]);

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  // ✅ Now safe to conditionally render UI
  if (!vendor) {
    return <div className="text-center mt-10 text-red-600">Vendor not found.</div>;
  }

  return (
    <section className="p-6 w-full bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-3">
        <BackButton />
        
        <NavLink
          to={`/admin/vendor/edit-delete/${vendor._id}`}
          className="flex items-center gap-2 px-3 md:px-6 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
        >
          <FiEdit size={20} />
          <span className="hidden md:inline-block">Edit Vendor</span>
        </NavLink>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">{vendor.shopName} - Overview</h2>

      <div className="w-full h-full flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 mb-8">
        <div className="md:w-[85%] h-full bg-white rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 px-4 py-6">
          <StatGrid cards={getVendorCardData(vendor)} />
        </div>
        <div className="w-[80%] mx-auto md:w-[15%] md:mx-0 h-full bg-white rounded-xl shadow-md shadow-purple-500 overflow-hidden">
          <img
            src={vendor.profileImage}
            alt={vendor.name}
            title={`${vendor.name}'s profile image`}
            className="w-full h-[210px] md:h-[250px] object-cover rounded-xl hover:scale-105 transition duration-300"
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales (Last 6 Months)</h3>
      <div className="bg-white rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 border border-gray-200 p-4 mb-10">
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

export default VendorProfile;
