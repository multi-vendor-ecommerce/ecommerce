import React, { useState } from "react";
import {
  FaHeart,
  FaRandom,
  FaShoppingCart,
  FaSearch,
  FaBars,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { categoryData, navCategories } from "../Utils/HeaderData";
import { useCart } from "../Cart/CartContext";

function UserHeader() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const mainCategories = Object.keys(categoryData);
  const { cartItems } = useCart(); // 🎯 get items from cart context

  return (
    <div className="border-b">
      {/* Top Strip */}
      <div className="bg-user-base py-2 border-t-2">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <p className="text-user-dark">
            Get up to 50% off new season styles, limited time only
          </p>
          <div className="flex items-center gap-6 text-user-dark">
            <a href="#" className="hover:text-user-primary">Help Center</a>
            <a href="#" className="hover:text-user-primary">Order Tracking</a>
            <select className="bg-transparent outline-none text-user-dark">
              <option>🇺🇸 English</option>
              <option>🇮🇳 Hindi</option>
            </select>
            <select className="bg-transparent outline-none text-user-dark">
              <option>USD</option>
              <option>INR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-user-primary">
            <span className="text-user-dark">CLASSY</span>SHOP
          </Link>

          {/* Search Bar */}
          <div className="w-[50%] flex">
            <input
              type="text"
              placeholder="Search products here..."
              className="w-full px-4 py-2 border border-user-primary rounded-l-md focus:outline-none text-user-dark"
            />
            <button className="bg-user-primary px-4 text-white font-semibold rounded-r-md">
              <FaSearch />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6 text-user-dark text-lg">
            <NavLink to="/admin" className="font-bold">Admin</NavLink>

            <Link to="/login" className="hover:text-user-primary">
              Login / Register
            </Link>

            <Link to="/wishlist">
              <FaHeart className="cursor-pointer hover:text-user-primary" />
            </Link>

            <FaRandom className="cursor-pointer hover:text-user-primary" />

            <Link to="/cart" className="relative">
              <FaShoppingCart className="hover:text-user-primary" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-user-primary text-white w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-user-base shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-start gap-8 relative">
          {/* Categories Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-2 font-medium cursor-pointer hover:text-user-primary text-user-dark">
              <FaBars />
              <span>SHOP BY CATEGORIES</span>
            </div>

            <div className="absolute left-0 top-full z-50 hidden group-hover:flex mt-2">
              {/* Main Category List */}
              <ul className="bg-white w-60 border shadow-md rounded-l-md overflow-hidden">
                {mainCategories.map((category, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-user-secondary border-b"
                    onMouseEnter={() => setHoveredCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>

              {/* Subcategory List */}
              {hoveredCategory && (
                <ul className="bg-white w-60 border shadow-md rounded-r-md">
                  {categoryData[hoveredCategory].map((sub, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 text-sm hover:bg-user-base border-b"
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Top Navigation Menus */}
          <div className="flex items-center gap-6 text-sm font-medium text-user-dark">
            {Object.entries(navCategories).map(([main, subItems], index) => (
              <div key={index} className="relative group cursor-pointer">
                <span className="hover:text-user-primary">{main}</span>
                <div className="absolute top-full left-0 z-30 bg-white shadow-md rounded-md py-2 w-48 hidden group-hover:block">
                  <ul>
                    {subItems.map((sub, i) => (
                      <li key={i} className="px-4 py-2 hover:bg-user-base">
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="ml-auto text-sm text-green-700 font-semibold">
            Free International Delivery
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
