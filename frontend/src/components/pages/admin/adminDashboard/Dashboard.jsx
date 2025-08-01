import { useState, useContext, useEffect } from "react";
import SummaryCards from "./SummaryCards";
import RecentOrders from "./RecentOrders";
import SalesChart from "./SalesChart";
import TopProducts from "./TopProducts";
import { monthlySalesData } from "./data/salesData";
import TopVendors from "./TopVendors";
import CustomSelect from "../../../common/layout/CustomSelect";
import { dateFilterFields } from "./data/summaryData";
import ProductContext from "../../../../context/products/ProductContext";
import UserContext from "../../../../context/user/UserContext";
import OrderContext from "../../../../context/orders/OrderContext";
import VendorContext from "../../../../context/vendors/VendorContext";
import Spinner from "../../../common/Spinner";

const Dashboard = () => {
  const { getAllProducts } = useContext(ProductContext);
  const { getAllCustomers } = useContext(UserContext);
  const { getAllOrders } = useContext(OrderContext);
  const { getAllVendors } = useContext(VendorContext);
  const [dateValue, setDateValue] = useState("today");

  const handleChange = (name, value) => {
    if (name === "date") setDateValue(value);
  };

  useEffect(() => {
    getAllProducts();
    getAllCustomers();
    getAllOrders();
    getAllVendors();
  }, []);

  return (
    <section aria-label="Admin Dashboard" className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-gray-200 pl-4 pr-3 py-2.5 rounded-xl">
        Admin Dashboard
      </h1>

      <div className="mt-6 bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-3">Overview</h2>

          <div>
            <CustomSelect
              options={dateFilterFields[0].options}
              value={dateValue}
              onChange={(newValue) => handleChange("date", newValue)}
              menuPlacement="bottom"
            />
          </div>
        </div>

        <SummaryCards />
        <div className="mt-6">
          <SalesChart data={monthlySalesData} />
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
