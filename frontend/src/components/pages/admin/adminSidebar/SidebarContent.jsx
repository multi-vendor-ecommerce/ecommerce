import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { adminSidebarMenu } from './adminSidebarMenu';

const SidebarContent = ({ isMobileOpen }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // 1024 = lg

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Conditionally hide/show sidebar based on screen
  const shouldShowSidebar = isLargeScreen || isMobileOpen;
  if (!shouldShowSidebar) return null;

  return (
    <aside className="w-full sticky top-0 h-full lg:h-screen overflow-y-auto bg-white p-5 shadow-md text-black border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-black text-white py-1 px-4 rounded-full">
          <span className="font-bold text-xl">A</span>
        </div>
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Menu Sections */}
      {adminSidebarMenu.map((section) => (
        <div key={section.section} className="mb-6">
          <p className="text-gray-500 font-medium mb-2">{section.section}</p>
          <ul>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isOpen = openMenus[item.key];

              return (
                <li key={item.label}>
                  <div
                    className="flex items-center justify-between cursor-pointer hover:text-black px-2 py-2 rounded-xl hover:bg-gray-200"
                    onClick={() => item.expandable && toggleMenu(item.key)}
                  >
                    <div className="flex items-center gap-4 text-gray-700 hover:text-black">
                      <div className="text-2xl">
                        <Icon />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.expandable && (
                      <FaChevronDown
                        className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </div>

                  {item.expandable && isOpen && (
                    <ul className="ml-6 mt-2 text-sm text-gray-600 space-y-2">
                      {item.children.map((child, idx) => (
                        <li key={idx} className="hover:text-black cursor-pointer">
                          {child}
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
