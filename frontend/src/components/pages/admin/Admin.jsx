import Dashboard from "./adminDashboard/Dashboard";
import Header from "./adminHeader/Header";
import Sidebar from "./adminSidebar/Sidebar";

const Admin = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="w-full md:w-[80%] flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow p-4">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Admin;
