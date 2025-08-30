import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

const SidebarContent = ({ isMobileOpen, menuData = [], panelLabel = "Panel", homePath = "/" }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // lg

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const newState = {};
    menuData.forEach((section) => {
      section.items.forEach((item) => {
        if (item.expandable) {
          const isChildActive = item.children?.some((c) =>
            location.pathname.startsWith(c.path)
          );
          newState[item.key] = isChildActive;
        }
      });
    });
    setOpenMenus((prev) => ({ ...prev, ...newState }));
  }, [location.pathname, menuData]);

  const toggleMenu = (key) =>
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const shouldShowSidebar = isLargeScreen || isMobileOpen;
  if (!shouldShowSidebar) return null;

  return (
    <aside className="w-full sticky top-0 h-full lg:h-screen overflow-y-auto bg-white pl-3 pr-1 py-5 shadow-md text-black border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-black text-white py-1 px-4 rounded-full">
          <span className="font-bold text-lg">{panelLabel[0]}</span>
        </div>
        <NavLink to={homePath} className="text-lg font-bold">
          {panelLabel}
        </NavLink>
      </div>

      {/* Menu Sections */}
      {menuData.map((section) => (
        <div key={section.section} className="mb-6">
          <p className="text-sm text-gray-500 font-medium mb-2">{section.section}</p>
          <ul>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isOpen = openMenus[item.key];

              return (
                <li key={item.label}>
                  {item.expandable ? (
                    <div
                      onClick={() => toggleMenu(item.key)}
                      className="flex items-center justify-between cursor-pointer hover:text-black px-2 py-2 rounded-xl hover:bg-gray-200"
                    >
                      <div className="flex items-center gap-4 text-gray-700 hover:text-black">
                        <Icon className="text-2xl" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <FaChevronDown
                        className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-2 py-2 rounded-xl hover:bg-gray-200 transition ${
                          isActive
                            ? "bg-gray-200 text-black font-semibold"
                            : "text-gray-700"
                        }`
                      }
                    >
                      <Icon className="text-2xl" />
                      <span className="text-sm">{item.label}</span>
                    </NavLink>
                  )}

                  {item.expandable && isOpen && (
                    <ul className="ml-6 mt-2 text-xs text-gray-600 space-y-2">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `block px-2 py-1 rounded hover:bg-gray-100 ${
                                isActive ? "text-black font-medium" : ""
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default SidebarContent;