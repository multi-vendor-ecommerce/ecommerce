import { useState, useRef, useEffect, useContext } from 'react';
import { RiMenu2Line } from 'react-icons/ri';
import { FiSettings } from 'react-icons/fi';
import { FaStore } from 'react-icons/fa';
import { IoGlobeOutline, IoNotificationsOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import PersonContext from '../../../../../context/person/PersonContext';
import ProfileImage from './ProfileImage';
import { capitalize } from '../../../../../utils/capitalize';

const Header = ({ onMenuToggle }) => {
  const { person, getCurrentPerson } = useContext(PersonContext);

  useEffect(() => {
    getCurrentPerson();
  }, []);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null); // 1️⃣ Reference to the menu area

  // 2️⃣ Close profile menu on outside click
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
    <header className="sticky top-0 w-full z-50 min-h-16 px-5 py-4 flex justify-between lg:justify-end items-center shadow-lg shadow-gray-100 bg-white/60 backdrop-blur-lg">
      {/* Left: Menu */}
      <div className="flex items-center group lg:hidden">
        <button onClick={onMenuToggle} className="focus:outline-none rounded-full hover:bg-gray-200 p-2 transition-all duration-300 cursor-pointer">
          <RiMenu2Line className="text-2xl text-gray-600 group-hover:text-black transition-all duration-300" />
        </button>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center justify-center gap-4 text-gray-600">
        {person && person.role === "admin" && (
          <a
            href='/login/vendor'
            target='_blank'
            rel="noopener noreferrer"
            className="py-2 flex items-center gap-2 px-4 border font-semibold rounded-lg transition duration-150 hover:bg-blue-500 text-blue-500 hover:text-white cursor-pointer"
            title="Login as Seller"
          >
            <FaStore size={20} />
            <span className="hidden md:inline">Login as Seller</span>
          </a>
        )}

        <NavLink className="hover:text-black hover:scale-105 transition-all duration-300 cursor-pointer">
          <IoGlobeOutline className="text-xl md:text-2xl" title="Languages" />
        </NavLink>

        <button className="hover:text-black hover:scale-105 transition-all duration-300 relative cursor-pointer">
          <IoNotificationsOutline className="text-2xl md:text-3xl" title="Notifications" />
          <span className="absolute -top-1.5 -right-0 text-[11px] bg-red-500 text-white rounded-full px-1.5 h-4 flex items-center justify-center font-semibold">
            1
          </span>
        </button>

        {person && (
          <button className="hover:text-black hover:scale-105 transition-all duration-300 cursor-pointer">
            <NavLink to={`/${person.role}/settings/profile`}>
              <FiSettings className="text-xl md:text-2xl" title="Settings" />
            </NavLink>
          </button>
        )}

        {/* Profile Icon + Dropdown */}
        {person && (
          <div className="relative" title={`${capitalize(person.role)}'s profile`} ref={profileMenuRef}>
            <button
              onClick={toggleProfileMenu}
              className="focus:outline-none hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <ProfileImage person={person} />
            </button>

            {showProfileMenu && <ProfileMenu person={person} />}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;