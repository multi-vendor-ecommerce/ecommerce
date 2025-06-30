import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./adminCommon/adminSidebar/Sidebar";
import Header from "./adminCommon/adminHeader/Header";
import Dashboard from "./adminDashboard/Dashboard";
import Orders from "./adminOrders/Orders";
import OrderDetails from "./adminOrders/OrderDetails";
import NotFoundPage from "../../common/notPageFound";
import Customers from "./adminCustomers/Customers";
import CouponsManager from "./couponManager/CouponManager";
import EmailTemplateEditor from "./adminEmailEditor/EmailTemplateEditor";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

            <Route path="/all-customers" element={<Customers />} />
            <Route path="/coupons" element={<CouponsManager />} />
            <Route path="/emails-template-editor" element={<EmailTemplateEditor />} />

            {/* Fallback route for unmatched paths */}
            <Route path="*" element={<NotFoundPage destination="/admin" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
