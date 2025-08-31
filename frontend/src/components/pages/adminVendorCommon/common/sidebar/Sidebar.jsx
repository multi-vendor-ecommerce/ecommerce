import { IoClose } from "react-icons/io5";
import SidebarContent from "./SidebarContent";

const Sidebar = ({ onClose, isOpen, menuData, panelLabel, homePath }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed top-0 left-0 z-80 w-64 h-full bg-white pt-2 pb-4 shadow-md border-r transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:block`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="flex justify-end mb-4 lg:hidden">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black px-2 border-r"
              title="Close"
            >
              <IoClose className="text-3xl" />
            </button>
          </div>

          <SidebarContent
            isMobileOpen={isOpen}
            menuData={menuData}
            panelLabel={panelLabel}
            homePath={homePath}
          />
        </div>
      </div>

      {/* Permanent Sidebar for lg+ */}
      <div className="w-[18%] hidden lg:block">
        <SidebarContent
          menuData={menuData}
          panelLabel={panelLabel}
          homePath={homePath}
        />
      </div>
    </>
  );
};

export default Sidebar;
