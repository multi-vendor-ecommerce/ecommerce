import SummaryCards from "./SummaryCards";
import RecentOrders from "./RecentOrders";
import SalesChart from "./SalesChart";
import TopCountries from "./TopCountries";
import TopProducts from "./TopProducts";
import { monthlySalesData } from "./data/salesData";
import TopVendors from "./TopVendors";

const Dashboard = () => {
  return (
    <section aria-label="Admin Dashboard" className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gray-200 pl-4 pr-3 py-2.5 rounded-xl">Admin Dashboard</h1>

      <div className="mt-6 bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <SummaryCards />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          <SalesChart data={monthlySalesData} />
          <TopCountries />
        </div>
      </div>

      <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <RecentOrders />
      </div>

      <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <TopProducts />
      </div>

      <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <TopVendors />
      </div>
    </section>
  );
};

export default Dashboard;
