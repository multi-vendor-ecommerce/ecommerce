import React, { useState } from "react";
import {
  FaHeart,
  FaRandom,
  FaShoppingCart,
  FaSearch,
  FaBars,
} from "react-icons/fa";
import { categoryData, navCategories } from "../Utils/HeaderData";

function UserHeader() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const mainCategories = Object.keys(categoryData);

  return (
    <div className="border-b">
      {/* Top Strip */}
      <div className="bg-gray-100 py-2 border-t-2">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <p className="text-gray-700">
            Get up to 50% off new season styles, limited time only
          </p>
          <div className="flex items-center gap-6 text-gray-600">
            <a href="#" className="hover:text-red-600">Help Center</a>
            <a href="#" className="hover:text-red-600">Order Tracking</a>
            <select className="bg-transparent outline-none">
              <option>🇺🇸 English</option>
              <option>🇮🇳 Hindi</option>
            </select>
            <select className="bg-transparent outline-none">
              <option>USD</option>
              <option>INR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-red-600">
            <span className="text-black">CLASSY</span>SHOP
          </div>

          <div className="w-[50%] flex">
            <input
              type="text"
              placeholder="Search products here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button className="bg-red-500 px-4 text-white font-semibold rounded-r-md">
              <FaSearch />
            </button>
          </div>

          <div className="flex items-center gap-6 text-gray-700 text-lg">
            <a href="#" className="hover:text-red-600">Login / Register</a>
            <FaHeart className="cursor-pointer hover:text-red-600" />
            <FaRandom className="cursor-pointer hover:text-red-600" />
            <div className="relative cursor-pointer">
              <FaShoppingCart className="hover:text-red-600" />
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
                1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-start gap-8 relative">
          {/* Categories Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-2 font-medium cursor-pointer hover:text-red-500">
              <FaBars />
              <span>SHOP BY CATEGORIES</span>
            </div>

            <div className="absolute left-0 top-full z-50 hidden group-hover:flex mt-2">
              {/* Main Category List */}
              <ul className="bg-white w-60 border shadow-md rounded-l-md overflow-hidden">
                {mainCategories.map((category, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-red-100 border-b"
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
                      className="px-4 py-2 text-sm hover:bg-gray-100 border-b"
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Top Navigation Dropdowns */}
          <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
            {Object.entries(navCategories).map(([main, subItems], index) => (
              <div key={index} className="relative group cursor-pointer">
                <span className="hover:text-red-600">{main}</span>
                <div className="absolute top-full left-0 z-30 bg-white shadow-md rounded-md py-2 w-48 hidden group-hover:block">
                  <ul>
                    {subItems.map((sub, i) => (
                      <li key={i} className="px-4 py-2 hover:bg-gray-100">
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="ml-auto text-sm text-green-600 font-semibold">
            Free International Delivery
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
