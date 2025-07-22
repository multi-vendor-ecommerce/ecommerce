import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./vendorCommon/vendorSidebar/Sidebar";
import Header from "./vendorCommon/vendorHeader/Header";

const Vendor = () => {
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
      </div>
    </div>
  );
};

export default Vendor;