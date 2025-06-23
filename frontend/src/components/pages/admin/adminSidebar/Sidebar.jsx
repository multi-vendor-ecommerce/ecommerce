import React, { useState } from 'react';
import { FaStore, FaChevronDown } from 'react-icons/fa';
import { menuItems } from './menuItems';

const VendorSidebar = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-full md:w-[20%] min-h-screen bg-white p-5 shadow-md shadow-gray-100 text-gray-800 border-r border-gray-300">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-black text-white p-2 rounded-full">
          <FaStore />
        </div>
        <h1 className="text-xl font-bold">Vendor Panel</h1>
      </div>

      {/* Render Sections */}
      {menuItems.map((section) => (
        <div key={section.section} className="mb-6">
          <p className="text-sm text-gray-400 font-medium mb-2">{section.section}</p>
          <ul className="space-y-3">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isOpen = openMenus[item.key];

              return (
                <li key={item.label}>
                  <div
                    className="flex items-center justify-between cursor-pointer hover:text-black"
                    onClick={() => item.expandable && toggleMenu(item.key)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon />
                      {item.label}
                    </div>
                    {item.expandable && (
                      <FaChevronDown
                        className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </div>

                  {item.expandable && isOpen && (
                    <ul className="ml-6 text-sm text-gray-600 mt-2 space-y-2">
                      {item.children.map((child, i) => (
                        <li key={i} className="hover:text-black cursor-pointer">{child}</li>
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

export default VendorSidebar;
