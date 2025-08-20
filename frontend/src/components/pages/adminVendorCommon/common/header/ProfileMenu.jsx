import { HiOutlineLogout } from 'react-icons/hi';
import { RiLockLine } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';
import { useContext } from 'react';
import { NavLink } from "react-router-dom";
import AuthContext from '../../../../../context/auth/AuthContext';
import ProfileImage from './ProfileImage';
import { FaShoppingBag } from 'react-icons/fa';

const ProfileMenu = ({ person }) => {
  const { logout } = useContext(AuthContext);

  const handleLogOut = () => {
    logout(person.role);
  }

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl shadow-gray-500 z-50">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <ProfileImage person={person} />

          <div>
            <p className="font-semibold text-gray-800 hover:scale-110 transition duration-300" title={person.name}>{person.name}</p>
            <p className="text-gray-500 text-xs hover:scale-110 transition duration-300" title={person.email}>{person.email}</p>
          </div>
        </div>
      </div>

      <div className="w-[90%] mx-auto h-[1px] bg-gray-300"></div>

      <ul className="py-2 w-full text-black text-[16px] md:text-lg">
        <li className="px-4 mx-2 pt-2 pb-3 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer">
          <NavLink to={`/${person.role}/settings/profile`} className="flex items-center gap-2 hover:scale-105 transition duration-300">
            <FiUser size={22} className="text-xl font-semibold" />
            <span>Profile</span>
          </NavLink>
        </li>
        <li className="px-4 mx-2 pt-2 pb-3 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer" title="Change password">
          <NavLink to={`/${person.role}/settings/security`} className="flex items-center gap-2 hover:scale-105 transition duration-300">
            <RiLockLine size={22} className="text-xl font-semibold" />
            <span>Security</span>
          </NavLink>
        </li>
        {person.role === "customer" && (
          <li className="px-4 mx-2 pt-2 pb-3 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer">
            <NavLink to={`/orders`} className="flex items-center gap-2 hover:scale-105 transition duration-300">
              <FaShoppingBag size={22} className="text-xl font-semibold" />
              <span>My Orders</span>
            </NavLink>
          </li>
        )}
        <div className="w-[90%] mx-auto h-[1px] bg-gray-300 mt-2 mb-1.5"></div>
        <li className="px-4 mx-2 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer text-red-600" title="Sign out">
          <button onClick={handleLogOut} className="flex items-center gap-2 cursor-pointer hover:scale-105 transition duration-300">
            <HiOutlineLogout size={22} className="text-xl font-semibold" />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ProfileMenu;