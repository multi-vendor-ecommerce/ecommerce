import { useState, useRef, useEffect } from 'react';
import { RiMenu2Line } from 'react-icons/ri';
import { IoGlobeOutline, IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';

import ProfileMenu from './ProfileMenu';

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null); // 1️⃣ Reference to the menu area

  // 2️⃣ Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  return (
    <header className="w-full h-16 px-5 py-3 flex justify-between items-center shadow-lg shadow-gray-100 bg-white relative">
      {/* Left: Menu */}
      <div className="flex items-center group">
        <button className="focus:outline-none rounded-full hover:bg-gray-200 p-2 transition-all duration-300 cursor-pointer">
          <RiMenu2Line className="text-2xl text-gray-600 group-hover:text-black transition-all duration-300" />
        </button>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center justify-center gap-4 text-gray-600">
        <button className="hover:text-black hover:scale-105 transition-all duration-300 cursor-pointer">
          <IoGlobeOutline className="text-2xl" title="Languages" />
        </button>

        <button className="hover:text-black hover:scale-105 transition-all duration-300 relative cursor-pointer">
          <IoNotificationsOutline className="text-2xl" title="Notifications" />
          <span className="absolute -top-1.5 -right-1 text-[11px] bg-red-500 text-white rounded-full px-1.5 h-4 flex items-center justify-center font-semibold">
            1
          </span>
        </button>

        <button className="hover:text-black hover:scale-105 transition-all duration-300 cursor-pointer hover:animate-spin">
          <IoSettingsOutline className="text-2xl" title="Settings" />
        </button>

        {/* Profile Icon + Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={toggleProfileMenu}
            className="focus:outline-none hover:scale-105 transition-all duration-300"
          >
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover"
            />
          </button>

          {showProfileMenu && <ProfileMenu />}
        </div>
      </div>
    </header>
  );
};

export default Header;
