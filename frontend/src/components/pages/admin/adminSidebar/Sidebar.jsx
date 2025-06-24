import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { adminSidebarMenu } from './adminSidebarMenu';

const AdminSidebar = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="sticky top-0 left-0 w-full md:w-[20%] min-h-screen bg-white p-5 shadow-md text-black border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-black text-white py-1 px-4 rounded-full">
          <span className="font-bold text-xl">A</span>
        </div>
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Render menu sections */}
      {adminSidebarMenu.map((section) => (
        <div key={section.section} className="mb-6">
          <p className="text-gray-500 font-medium mb-2">{section.section}</p>
          <ul >
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
                      <div className='text-2xl'><Icon /></div>
                      <span>{item.label}</span>
                    </div>
                    {item.expandable && (
                      <FaChevronDown
                        className={`text-xs transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>

                  {item.expandable && isOpen && (
                    <ul className="ml-6 mt-2 text-sm text-gray-600 space-y-2">
                      {item.children.map((child, idx) => (
                        <li key={idx} className="hover:text-black cursor-pointer">{child}</li>
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

export default AdminSidebar;
