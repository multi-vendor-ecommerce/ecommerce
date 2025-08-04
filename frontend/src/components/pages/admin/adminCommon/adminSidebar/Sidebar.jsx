import { IoClose } from "react-icons/io5"; // close icon
import SidebarContent from "./SidebarContent";

const Sidebar = ({ onClose, isOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 z-80 w-64 md:w-70 h-full bg-white backdrop-blur-lg pt-2 pb-4 shadow-md border-r transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:block`}
          onClick={(e) => e.stopPropagation()} // Prevent closing on sidebar click
        >
          {/* Close Button (Only for Mobile) */}
          <div className="flex justify-end mb-4 lg:hidden  backdrop-blur-lg">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black px-2 border-r"
              title="Close"
            >
              <IoClose className="text-3xl" />
            </button>
          </div>

          <SidebarContent isMobileOpen={isOpen} />
        </div>
      </div>

      {/* Permanent Sidebar for lg+ screens */}
      <div className="w-[20%] hidden lg:block">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;