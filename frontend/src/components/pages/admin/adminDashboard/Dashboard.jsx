import SummaryCards from "./SummaryCards";
import RecentOrders from "./RecentOrders";
import SalesChart from "./SalesChart";
import TopCountries from "./TopCountries";
import TopProducts from "./TopProducts";
import { monthlySalesData } from "./data/salesData";

const Dashboard = () => {


  return (
    <section aria-label="Admin Dashboard" className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gray-200 pl-4 pr-3 py-2.5 rounded-xl">Admin Dashboard</h1>

      <div className="mt-6 bg-white px-4 py-6 rounded-xl shadow">
        <SummaryCards />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          <SalesChart data={monthlySalesData} />
          <TopCountries />
        </div>
      </div>

      <div className="mt-6">
        <RecentOrders />
      </div>

      <div className="mt-6">
        <TopProducts />
      </div>

      <div className="mt-10 p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Vendor Commission Management</h2>
        <p className="text-sm text-gray-600 mb-2">
          Vendor-wise commissions are editable by admin.
        </p>
        {/* This could be a table or editable form */}
        <div className="text-sm text-gray-500 italic">
          [Vendor commission editor coming soon...]
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
