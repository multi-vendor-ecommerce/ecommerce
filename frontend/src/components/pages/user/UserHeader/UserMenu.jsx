// components/UserHeader/UserMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import ProfileImage from "../../adminVendorCommon/common/header/ProfileImage";
import ProfileMenu from "../../adminVendorCommon/common/header/ProfileMenu";

function UserMenu({ person, displayName, logout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 hover:text-user-primary focus:outline-none cursor-pointer"
      >
        <ProfileImage person={person} />
        <div className="hidden sm:flex flex-col cursor-pointer">
          <span className="text-sm font-semibold">Hi, {displayName}</span>
          <span className="text-xs text-gray-400">Welcome back!</span>
        </div>
      </button>
      {dropdownOpen && <ProfileMenu logout={logout} person={person} />}
    </div>
  );
}

export default UserMenu;
