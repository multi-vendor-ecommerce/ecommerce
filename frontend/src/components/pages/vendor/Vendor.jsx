import { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { vendorSidebarMenu } from "./vendorCommon/vendorSidebar/vendorSidebarMenu";
import Sidebar from '../adminVendorCommon/common/sidebar/Sidebar';
import Header from "./vendorCommon/vendorHeader/Header";
import Dashboard from "./vendorDashboard/Dashboard";
import AuthContext from "../../../context/auth/AuthContext";
import NotFoundPage from "../../common/notPageFound";
import Products from "../adminVendorCommon/product/Products";
import ProductDetails from "../adminVendorCommon/product/ProductDetails";
import AddProduct from "../adminVendorCommon/product/addProduct/AddProduct";

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
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}  menuData={vendorSidebarMenu} panelLabel="Vendor Panel" homePath="/vendor" />

      {/* Main Content Area */}
      <div className="w-full lg:w-[80%] flex flex-col">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="all-products" element={<Products heading="All Products" role="vendor" />} />
            <Route path="product-details/:productId" element={<ProductDetails role="vendor" />} />
            <Route path="top-selling-products" element={<Products heading="Top Selling Products" role="vendor" />} />
            <Route path="add-product" element={<AddProduct isVendor={true} />} />

            {/* Fallback route for unmatched paths */}
            <Route path="*" element={<NotFoundPage destination="/vendor" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Vendor;