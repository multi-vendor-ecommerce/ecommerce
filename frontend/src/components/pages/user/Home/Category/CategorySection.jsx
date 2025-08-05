import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import CategorySidebar from "./CategorySideBar";

const CategorySection = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleParentClick = (categoryId) => {
        setSidebarOpen(true);
        setSelectedCategories([categoryId]); 
        loadCategories(categoryId, 0);
    };

    return (
        <div className="sticky z-5 bg-[#F9F7FC] px-6 py-3">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                    {/* All Categories Button */}
                    <div
                        onClick={() => setSidebarOpen(true)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(true)}
                        className="flex items-center gap-3 px-5 py-3 bg-[#7F55B1] hover:bg-[#6e45a1] text-white rounded-full shadow-lg cursor-pointer transition duration-200"
                    >
                        <FaCaretDown className="text-white text-xl" />
                        <span className="text-base font-semibold">All Categories</span>
                    </div>

                    {/* Parent Categories Horizontal Scroll */}
                    <div className="mt-3 md:mt-0 overflow-x-auto no-scrollbar flex-1">
                        <CategorySidebar showAsHorizontal parentCircleSize="large" />
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
    );
};

export default CategorySection;
