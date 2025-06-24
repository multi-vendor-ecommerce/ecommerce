import React from "react";
import { Link, Outlet, Route } from "react-router-dom";
import Address from "./Address";
<Route path="/profile/address" element={<Address />} />

export default function UserProfile() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white shadow rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold text-user-primary">My Account</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded hover:bg-user-secondary"
            >
              👤 Profile Overview
            </Link>
          </li>
          <li>
            <Link
              to="/profile/orders"
              className="block px-3 py-2 rounded hover:bg-user-secondary"
            >
              📦 My Orders
            </Link>
          </li>
          <li>
            <Link
              to="/profile/address"
              className="block px-3 py-2 rounded hover:bg-user-secondary"
            >
              🏠 My Addresses
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content (child routes) */}
      <div className="w-full md:w-3/4 bg-white shadow rounded p-4">
        <Outlet />
      </div>
    </div>
  );
}
