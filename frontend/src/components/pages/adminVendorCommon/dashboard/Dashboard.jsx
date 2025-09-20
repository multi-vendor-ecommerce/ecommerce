import { useContext, useState, useEffect } from "react";
import SummaryCards from "./SummaryCards";
import SalesChart from "./SalesChart";
import { monthlySalesData } from "./data/salesData";
import RecentOrders from "./RecentOrders";
import TopProducts from "./TopProducts";
import TopVendors from "../../admin/adminDashboard/TopVendors";
import Invoices from "../../vendor/vendorDashboard/Invoices";
import { dateFilterFields } from "./data/dateFilterFields";
import CustomSelect from "../../../common/layout/CustomSelect";
import UserContext from "../../../../context/user/UserContext";
import OrderContext from "../../../../context/orders/OrderContext";
import VendorContext from "../../../../context/vendors/VendorContext";

const Dashboard = ({ summaryData, role = "admin" }) => {
  const { getAllCustomers } = useContext(UserContext);
  const { getAllOrders } = useContext(OrderContext);
  const { getTopVendors } = useContext(VendorContext);

  useEffect(() => {
    getAllCustomers();
    getAllOrders();
    if (role === "admin") getTopVendors();
  }, []);

  const [dateValue, setDateValue] = useState("today");

  const handleChange = (name, value) => {
    if (name === "date") setDateValue(value);
  };

  return (
    <section aria-label="Admin Dashboard" className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 bg-gray-200 pl-4 pr-3 py-2.5 rounded-xl">
        {role === "admin" ? "Admin Dashboard" : "Vendor Dashboard"}
      </h1>

      <div className="mt-6 bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-3">Overview</h2>

          <div>
            <CustomSelect
              options={dateFilterFields[0].options}
              value={dateValue}
              onChange={(newValue) => handleChange("date", newValue)}
              menuPlacement="auto"
            />
          </div>
        </div>

        <SummaryCards summaryData={summaryData} />
        <div className="mt-6">
          <SalesChart data={monthlySalesData} />
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

      {role === "vendor" && (
        <div className="mt-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
          <Invoices />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
