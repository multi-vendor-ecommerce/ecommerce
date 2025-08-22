import { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { vendorSidebarMenu } from "./vendorSidebar/vendorSidebarMenu";
import Sidebar from '../adminVendorCommon/common/sidebar/Sidebar';
import Header from "../adminVendorCommon/common/header/Header";
import Dashboard from "../adminVendorCommon/dashboard/Dashboard";
import { getCards } from "./vendorDashboard/data/summaryData";
import AuthContext from "../../../context/auth/AuthContext";
import NotFoundPage from "../../common/notPageFound";
import Products from "../adminVendorCommon/product/Products";
import ProductDetails from "../adminVendorCommon/product/ProductDetails";
import AddProduct from "../adminVendorCommon/product/addProduct/AddProduct";
import Orders from "../adminVendorCommon/orders/Orders";
import OrderDetails from "../adminVendorCommon/orders/OrderDetails";
import Customers from "../adminVendorCommon/customers/Customers";
import Profile from "../adminVendorCommon/settings/Profile";
import Security from "../adminVendorCommon/settings/Security";
import StoreProfile from "./storeSettings/StoreProfile";

const Vendor = () => {
  const { authTokens } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const token = localStorage.getItem("vendorToken") || authTokens?.vendor;
  if (!token) {
    return <Navigate to="/login/vendor" replace />;
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} menuData={vendorSidebarMenu} panelLabel="Vendor Panel" homePath="/vendor" />

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

            <Route path="all-products" element={<Products heading="All Products" role="vendor" />} />
            <Route path="product-details/:productId" element={<ProductDetails role="vendor" />} />
            <Route path="top-selling-products" element={<Products heading="Top Selling Products" role="vendor" />} />
            <Route path="add-product" element={<AddProduct />} />

            {/* Settings */}
            <Route path="store/">
              <Route path="profile" element={<StoreProfile />} />
            </Route>

            {/* Settings */}
            <Route path="settings/">
              <Route path="profile" element={<Profile />} />
              <Route path="security" element={<Security />} />
            </Route>

            {/* Fallback route for unmatched paths */}
            <Route path="*" element={<NotFoundPage destination="/vendor" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Vendor;