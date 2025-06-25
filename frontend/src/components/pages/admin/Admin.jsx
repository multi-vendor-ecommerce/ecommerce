import { useState } from "react";
import Dashboard from "./adminDashboard/Dashboard";
import Header from "./adminHeader/Header";
import Sidebar from "./adminSidebar/Sidebar";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="w-full lg:w-[80%] flex flex-col">
        {/* Header with toggle */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-grow">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Admin;
