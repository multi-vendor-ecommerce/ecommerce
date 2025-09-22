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
import AddProduct from "./vendorProducts/AddProduct";
import Orders from "../adminVendorCommon/orders/Orders";
import OrderDetails from "../adminVendorCommon/orders/OrderDetails";
import Customers from "../adminVendorCommon/customers/Customers";
import Profile from "../adminVendorCommon/settings/Profile";
import Security from "../adminVendorCommon/settings/Security";
import StoreProfile from "./storeSettings/StoreProfile";
import PersonContext from "../../../context/person/PersonContext";
import Loader from "../../common/Loader";
import VendorStatus from "./vendorStatus/VendorStatus";
import EditProduct from "../adminVendorCommon/product/EditProduct";
import Invoices from "../adminVendorCommon/invoices/Invoices";

const Vendor = () => {
  const { authTokens } = useContext(AuthContext);
  const { person, loading } = useContext(PersonContext); // Make sure you have a loading state in your context
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const role = person?.role || "vendor";
  const token = localStorage.getItem("vendorToken") || authTokens?.vendor;

  if (!token) {
    return <Navigate to="/login/vendor" replace />;
  }

  // Show loader while person is loading
  if (loading && !person) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  const statuses = ["pending", "suspended", "rejected", "inactive"];
  if (person && statuses.includes(person.status)) {
    return <VendorStatus status={person.status} />;
  }

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} menuData={vendorSidebarMenu} panelLabel="Vendor Panel" homePath="/vendor" />

      {/* Main Content Area */}
      <div className="w-full lg:w-[82%] flex flex-col">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard summaryData={getCards} role={role} />} />

            {/* Nested route block for orders */}
            <Route path="all-orders/">
              <Route index element={<Orders role={role} />} />
              <Route path="order-details/:orderId" element={<OrderDetails role={role} />} />
            </Route>

            <Route path="invoices" element={<Invoices role={role} />} />

            <Route path="all-customers" element={<Customers />} />

            <Route path="all-products" element={<Products heading="All Products" role={role} />} />
            <Route path="product-details/:productId" element={<ProductDetails role={role} />} />
            <Route path="top-selling-products" element={<Products heading="Top Selling Products" role={role} />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="product/edit-delete/:productId" element={<EditProduct />} />

            {/* Settings */}
            <Route path="store/">
              <Route path="profile" element={<StoreProfile />} />
            </Route>

            {/* Settings */}
            <Route path="settings/">
              <Route path="profile" element={<Profile role={role} />} />
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