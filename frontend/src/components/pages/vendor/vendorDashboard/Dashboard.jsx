import SummaryCards from "./SummaryCards";
import RecentOrders from "./RecentOrders";
import SalesChart from "./SalesChart";
import TopProducts from "./TopProducts";
// import { monthlySalesData } from "./data/salesData";
import TaxesAndInvoices from "./TaxesAndInvoices";

const Dashboard = () => {
  return (
    <section aria-label="Vendor Dashboard" className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gray-200 pl-4 pr-3 py-2.5 rounded-xl">Vendor Dashboard</h1>

      <div className="mt-6 bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <SummaryCards />

        {/* <SalesChart data={monthlySalesData} /> */}
      </div>

      <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <RecentOrders />
      </div>

      <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <TopProducts />
      </div>

      <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <TaxesAndInvoices />
      </div>
    </section>
  );
};

export default Dashboard;

