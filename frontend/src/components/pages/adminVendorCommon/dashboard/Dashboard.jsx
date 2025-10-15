import { useContext, useEffect, useState } from "react";
import SummaryCards from "./SummaryCards";
import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";
import TopProducts from "./TopProducts";
import TopVendors from "../../admin/adminDashboard/TopVendors";
import { dateFilterFields } from "./data/dateFilterFields";
import CustomSelect from "../../../common/layout/CustomSelect";
import OrderContext from "../../../../context/orders/OrderContext";

const Dashboard = ({ summaryData, role = "admin" }) => {
  const { salesData, getSalesTrend } = useContext(OrderContext);
  const [dateValue, setDateValue] = useState("today");

  const handleChange = (name, value) => {
    if (name === "date") {
      setDateValue(value);
      getSalesTrend(value);
    }
  };

  return (
    <section aria-label="Admin Dashboard" className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 bg-gray-200 pl-4 pr-3 py-2.5 rounded-xl">
        {role === "admin" ? "Admin Dashboard" : "Your Vendor Dashboard"}
      </h1>

      <div className="mt-6 bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-3">Overview</h2>
          <CustomSelect
            options={dateFilterFields[0].options}
            value={dateValue}
            onChange={(newValue) => handleChange("date", newValue)}
            menuPlacement="auto"
          />
        </div>

        <SummaryCards summaryData={summaryData} range={dateValue} handleChange={handleChange} />

        <div className="mt-6">
          <SalesChart data={salesData} />
        </div>
      </div>

      <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <RecentOrders role={role} />
      </div>

      <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <TopProducts />
      </div>

      {role === "admin" && (
        <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
          <TopVendors />
        </div>
      )}
    </section>
  );
};

export default Dashboard;