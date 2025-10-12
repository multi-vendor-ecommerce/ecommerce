import { useContext, useEffect, useState } from "react";
import SummaryCards from "./SummaryCards";
import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";
import TopProducts from "./TopProducts";
import TopVendors from "../../admin/adminDashboard/TopVendors";
import { dateFilterFields } from "./data/dateFilterFields";
import CustomSelect from "../../../common/layout/CustomSelect";
import UserContext from "../../../../context/user/UserContext";
import OrderContext from "../../../../context/orders/OrderContext";
import ProductContext from "../../../../context/products/ProductContext";
import VendorContext from "../../../../context/vendors/VendorContext";

const Dashboard = ({ summaryData, role = "admin" }) => {
  const { users, getAllCustomers } = useContext(UserContext);
  const { orders, getAllOrders, salesData, getSalesTrend } = useContext(OrderContext);
  const { getAllProducts } = useContext(ProductContext);
  const { getTopVendors } = useContext(VendorContext);

  const [dateValue, setDateValue] = useState("today");
  const [products, setProducts] = useState([]); // ✅ Store products here

  // Fetch all data on mount
  useEffect(() => {
    fetchDashboardData(dateValue);
  }, []);

  const fetchDashboardData = async (date) => {
    getAllCustomers();
    getAllOrders();
    getSalesTrend(date);
    if (role === "admin") getTopVendors();

    // Fetch products and save to state
    const productResult = await getAllProducts();
    if (productResult?.products) setProducts(productResult.products);
  };

  const handleChange = (name, value) => {
    if (name === "date") {
      setDateValue(value);
      fetchDashboardData(value); // ✅ Refetch all data for selected date
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

        <SummaryCards summaryData={summaryData} users={users} orders={orders} products={products} />

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