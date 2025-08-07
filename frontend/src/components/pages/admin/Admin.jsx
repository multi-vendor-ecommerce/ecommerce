import { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { adminSidebarMenu } from "./adminSidebar/adminSidebarMenu";
import Sidebar from "../adminVendorCommon/common/sidebar/Sidebar";
import Header from "../adminVendorCommon/common/header/Header";
import Dashboard from "../adminVendorCommon/dashboard/Dashboard";
import { getCards } from "./adminDashboard/data/summaryData";
import NotFoundPage from "../../common/notPageFound";
import Customers from "../adminVendorCommon/customers/Customers";
import CouponsManager from "./couponManager/CouponManager";
import EmailTemplateEditor from "./adminEmailEditor/EmailTemplateEditor";
import VendorManagement from "./adminVendor/VendorManagement";
import CommissionOverview from "./adminCommissions/CommissionOverview";
import VendorProfile from "./adminVendor/VendorProfile";
import AuthContext from "../../../context/auth/AuthContext";
import Products from "../adminVendorCommon/product/Products";
import ProductDetails from "../adminVendorCommon/product/ProductDetails";
import AddProduct from "../adminVendorCommon/product/addProduct/AddProduct";
import Orders from "../adminVendorCommon/orders/Orders";
import OrderDetails from "../adminVendorCommon/orders/OrderDetails";

const Admin = () => {
  const { authTokens } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const token = localStorage.getItem("adminToken") || authTokens?.admin;
  if (!token) {
    return <Navigate to="/login/admin" replace />;
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} menuData={adminSidebarMenu} panelLabel="Admin Panel" homePath="/admin" />

      {/* Main Content Area */}
      <div className="w-full lg:w-[80%] flex flex-col">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard summaryData={getCards} />} />

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
            <Route path="add-product" element={<AddProduct />} />
            <Route path="product/edit-delete/:productId" element={<OrderDetails />} />

            <Route path="all-vendors" element={<VendorManagement heading="All Vendors" />} />
            <Route path="top-vendors" element={<VendorManagement heading="Top Vendors" />} />
            <Route path="vendors/commission-overview" element={<CommissionOverview />} />
            <Route path="vendor/profile/:vendorId" element={<VendorProfile />} />

            {/* Fallback route for unmatched paths */}
            <Route path="*" element={<NotFoundPage destination="/admin" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
