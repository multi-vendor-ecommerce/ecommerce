import React, { useState } from "react";

const CategoryColumn = ({
  data = [],
  onNavigate,
  isMobile,
  parentId,
  fetchSubcategories,
  level,
}) => {
  const [activeSubId, setActiveSubId] = useState(null);
  const [nestedSubCategories, setNestedSubCategories] = useState({});

  const handleSubHover = async (subcategory) => {
    setActiveSubId(subcategory._id);

    if (!nestedSubCategories[subcategory._id] && subcategory.subcategories) {
      setNestedSubCategories((prev) => ({
        ...prev,
        [subcategory._id]: subcategory.subcategories,
      }));
    }
  };

  return (
    <div
      className="absolute left-full top-0 mt-2 bg-white shadow-lg border rounded-md z-50 min-w-[200px] min-h-100"
      onMouseLeave={() => setActiveSubId(null)}
    >
      <ul className="divide-y divide-gray-100">
        {data.map((subcategory) => (
          <li
            key={subcategory._id}
            className="relative group px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onNavigate(subcategory._id)}
            onMouseEnter={() => handleSubHover(subcategory)}
          >
            {subcategory.name}
            {subcategory.subcategories?.length > 0 && (
              <span className="absolute right-2">▶</span>
            )}

            {/* Level 3 Column */}
            {activeSubId === subcategory._id &&
              nestedSubCategories[subcategory._id]?.length > 0 && (
                <div className="absolute left-full top-0 bg-white shadow-lg border rounded-md min-w-[200px] z-50">
                  <ul className="divide-y divide-gray-100">
                    {nestedSubCategories[subcategory._id].map((item) => (
                      <li
                        key={item._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onNavigate(item._id)}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryColumn;
