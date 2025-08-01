import { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AuthContext from "../../../context/auth/AuthContext";

import Sidebar from "./adminCommon/adminSidebar/Sidebar";
import Header from "./adminCommon/adminHeader/Header";
import Dashboard from "./adminDashboard/Dashboard";
import Orders from "./adminOrders/Orders";
import OrderDetails from "./adminOrders/OrderDetails";
import NotFoundPage from "../../common/notPageFound";
import Customers from "./adminCustomers/Customers";
import CouponsManager from "./couponManager/CouponManager";
import EmailTemplateEditor from "./adminEmailEditor/EmailTemplateEditor";
import Products from "./adminProducts/Products";
import VendorManagement from "./adminVendor/VendorManagement";
import CommissionOverview from "./adminCommissions/CommissionOverview";
import VendorProfile from "./adminVendor/VendorProfile";
import ProductDetails from "./adminProducts/ProductDetails";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = authTokens?.admin || localStorage.getItem("adminToken");

    // Token is still loading
    if (!token && authTokens === null) return;

    // No token found, redirect to login
    if (!token) {
      navigate("/login/admin", { replace: true });
    }
  }, [authTokens, navigate]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="w-full lg:w-[80%] flex flex-col">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            {/* Nested route block for orders */}
            <Route path="all-orders/">
              <Route index element={<Orders />} />
              <Route path="order-details/:orderId" element={<OrderDetails />} />
            </Route>

            <Route path="all-customers" element={<Customers />} />
            <Route path="coupons" element={<CouponsManager />} />
            <Route path="emails-template-editor" element={<EmailTemplateEditor />} />

            <Route path="all-products" element={<Products heading="All Products" />} />
            <Route path="product-details/:productId" element={<ProductDetails />} />
            <Route path="top-selling-products" element={<Products heading="Top Selling Products" />} />
            <Route path="product/edit-delete/:productId" element={<OrderDetails />} />

            <Route path="all-vendors" element={<VendorManagement heading="All Vendors" />} />
            <Route path="top-vendors" element={<VendorManagement heading="Top Vendors" />} />
            <Route path="vendors/commission-overview" element={<CommissionOverview />} />
            <Route path="vendor/profile/:vendorId" element={<VendorProfile />} />

            <Route path="*" element={<NotFoundPage destination="/admin" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
