import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import CategoryContext from "../../../../../context/categories/CategoryContext";

const AccordionItem = ({ category, fetchSubcategories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState([]);

  const toggle = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && children.length === 0) {
      const subs = await fetchSubcategories(category._id);
      setChildren(subs);
    }
  };

  return (
    <div>
      <div
        onClick={toggle}
        className="flex justify-between items-center py-2 px-3 cursor-pointer hover:bg-gray-200 rounded"
      >
        <span>{category.name}</span>
        <span className="text-xl select-none">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && children.length > 0 && (
        <div className="ml-4 border-l border-gray-300 pl-3">
          {children.map((sub) => (
            <AccordionItem
              key={sub._id}
              category={sub}
              fetchSubcategories={fetchSubcategories}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategorySidebar = ({
  isOpen = false,
  onClose = () => {},
  showAsHorizontal = false,
  parentCircleSize = "normal",
}) => {
  const { categoriesByParentId } = useContext(CategoryContext);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await categoriesByParentId(null);
      setParents(data);
    })();
  }, []);

  // Horizontal circle style for parent categories
  if (showAsHorizontal) {
    const sizeClass =
      parentCircleSize === "large" ? "w-20 h-20 text-sm" : "w-14 h-14 text-xs";

    return (
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {parents.map((cat) => (
          <div
            key={cat._id}
            className="flex flex-col items-center text-gray-700 cursor-pointer select-none"
            title={cat.name}
          >
            <div
              className={`bg-gray-100 rounded-full flex items-center justify-center shadow-sm ${sizeClass} font-semibold`}
            >
              {cat.name.slice(0, 2).toUpperCase()}
            </div>
            <span
              className={`mt-1 truncate ${
                parentCircleSize === "large" ? "text-base" : "text-xs"
              }`}
              style={{ maxWidth: parentCircleSize === "large" ? "5rem" : "3.5rem" }}
              title={cat.name}
            >
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Sidebar with overlay and accordion
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/20 -sm"
          onClick={onClose}
        >
          <div
            className="absolute top-0 left-0 w-72 max-w-full h-full bg-white shadow-md overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">All Categories</h3>
              <button
                onClick={onClose}
                aria-label="Close categories sidebar"
                className="text-gray-700 hover:text-gray-900"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Accordion List */}
            <div className="space-y-2">
              {parents.map((cat) => (
                <AccordionItem
                  key={cat._id}
                  category={cat}
                  fetchSubcategories={categoriesByParentId}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategorySidebar;
