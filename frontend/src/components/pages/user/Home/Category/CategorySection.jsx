import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import CategorySidebar from "./CategorySidebar";
import Spinner from "../../../../common/Spinner";

const HEADER_HEIGHT = "4rem"; // Adjust if your header is a different height

const CategorySection = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highlightedCategory, setHighlightedCategory] = useState(null);

  return (
    <div
      className="px-6 py-3"
      style={{ top: HEADER_HEIGHT }} // Ensures it appears below the header
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          {/* All Categories Button */}
          <div
            onClick={() => {
              setSidebarOpen(true);
              setHighlightedCategory(null);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(true)}
            className="flex items-center gap-3 px-5 py-3 bg-[#2E7D32] hover:bg-[#43A047] text-white rounded-full shadow-lg cursor-pointer transition duration-200"
          >
            <FaCaretDown className="text-white text-xl" />
            <span className="text-base font-semibold">All Categories</span>
          </div>

          {/* Parent Categories Horizontal Scroll */}
          <div className="mt-3 md:mt-0 overflow-x-auto no-scrollbar flex-1">
            <CategorySidebar
              showAsHorizontal
              parentCircleSize="large"
              onParentClick={(catId) => {
                setSidebarOpen(true);
                setHighlightedCategory(catId);
              }}
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        highlightedCategory={highlightedCategory}
      />
    </div>
  );
};

export default CategorySection;