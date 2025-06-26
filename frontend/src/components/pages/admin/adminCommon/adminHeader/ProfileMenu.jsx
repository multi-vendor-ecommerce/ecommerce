import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import { IoSettingsOutline as IoSetting } from 'react-icons/io5';
import { RiHistoryLine } from 'react-icons/ri';

const ProfileMenu = () => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl shadow-gray-200 z-50">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">Angelina Gotelli</p>
            <p className="text-gray-500 text-xs">admin-01@ecme.com</p>
          </div>
        </div>
      </div>
      <ul className="py-2 px-2 text-black">
        <li className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer">
          <HiOutlineUser className="text-xl font-semibold" />
          <span>Profile</span>
        </li>
        <li className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer">
          <IoSetting className="text-xl font-semibold" /> 
          <span>Account Setting</span>
        </li>
        <li className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer">
          <RiHistoryLine className="text-xl font-semibold" />
          <span>Activity Log</span>
        </li>
        <hr className="my-1" />
        <li className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer text-red-600">
          <HiOutlineLogout className="text-xl font-semibold" />
          <span>Sign Out</span>
        </li>
      </ul>
    </div>
  )
}

export default ProfileMenu;