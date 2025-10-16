import { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useCategorySelection from "../../../../../hooks/useCategorySelection";
import { encryptData } from "../../Utils/Encryption";
import CategoryContext from "../../../../../context/categories/CategoryContext";
import { toTitleCase } from "../../../../../utils/titleCase";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { FiPlus } from "react-icons/fi";

// AccordionItem Component
const AccordionItem = ({
  category,
  levelIndex,
  handleCategoryClick,
  categoryLevels,
  categoriesByParentId,
  openIndexes,
  setOpenIndexes,
}) => {
  const navigate = useNavigate();
  const isOpen = openIndexes[levelIndex] === category._id;

  const handleToggle = async (e) => {
    e.stopPropagation();
    setOpenIndexes((prev) => ({
      ...prev,
      [levelIndex]: isOpen ? null : category._id,
    }));
    if (!isOpen) {
      await handleCategoryClick(category._id, levelIndex);
    }
  };

  const handleNameClick = async (e) => {
    e.stopPropagation();
    await handleCategoryClick(category._id, levelIndex);
    const children = await categoriesByParentId(category._id);
    if (!children || children.length === 0) {
      const secretKey = import.meta.env.VITE_SECRET_KEY;
      const encryptedId = encryptData(category._id, secretKey);
      navigate(`/category/${encryptedId}`);
    } else {
      setOpenIndexes((prev) => ({
        ...prev,
        [levelIndex]: isOpen ? null : category._id,
      }));
    }
  };

  return (
    <div>
      <div
        className={`sticky z-40 flex justify-between items-center py-2 px-3 rounded cursor-pointer select-none ${isOpen
          ? "bg-[#E8F5E9] font-semibold text-[#2E7D32]"
          : "hover:bg-[#F1F8E9]"
          }`}
      >
        <span
          onClick={handleNameClick}
          title={toTitleCase(category.name)}
          className="flex-1"
        >
          {toTitleCase(category.name)}
        </span>
        <span
          onClick={handleToggle}
          className="text-xl select-none px-2 mt-1 cursor-pointer"
          title={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <IoClose /> : <FiPlus />}
        </span>
      </div>
      {isOpen && categoryLevels[levelIndex + 1]?.length > 0 && (
        <div className="ml-4 border-l border-gray-300 pl-3 mt-1">
          {categoryLevels[levelIndex + 1].map((sub) => (
            <AccordionItem
              key={sub._id}
              category={sub}
              levelIndex={levelIndex + 1}
              handleCategoryClick={handleCategoryClick}
              categoryLevels={categoryLevels}
              categoriesByParentId={categoriesByParentId}
              openIndexes={openIndexes}
              setOpenIndexes={setOpenIndexes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategorySidebar = ({
  isOpen = false,
  onClose = () => { },
  showAsHorizontal = false,
  parentCircleSize = "normal",
  highlightedCategory = null,
  onParentClick,
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [openIndexes, setOpenIndexes] = useState({});
  const { categoriesByParentId } = useContext(CategoryContext);

  const { categoryLevels, loadCategories, handleCategoryClick } =
    useCategorySelection(() => { }, setSelectedCategories, selectedCategories);

  useEffect(() => {
    loadCategories(null, 0);
  }, []);

  useEffect(() => {
    if (highlightedCategory && isOpen) {
      setSelectedCategories([highlightedCategory]);
      setOpenIndexes({ 0: highlightedCategory });
      loadCategories(highlightedCategory, 0);
    }
  }, [highlightedCategory, isOpen]);

  if (showAsHorizontal) {
    const sizeClass =
      parentCircleSize === "large" ? "w-20 h-20 text-sm" : "w-14 h-14 text-xs";
    const rootCategories = categoryLevels[0] || [];
    console.log(rootCategories);

    return (
      <div className="w-full">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView="auto"
          grabCursor
        >
          {rootCategories.map((cat) => (
            <SwiperSlide
              key={cat._id}
              className="!w-auto flex flex-col items-center text-gray-700 cursor-pointer select-none"
              onClick={() => {
                if (typeof onParentClick === "function") {
                  onParentClick(cat._id);
                }
              }}
              title={toTitleCase(cat.name)}
            >
              <div
                className={`bg-gray-100 rounded-full flex items-center justify-center shadow-sm overflow-hidden ${sizeClass} font-semibold`}
              >
                {(cat.image || cat.categoryImage)
                  ? (
                    <img
                      src={cat.image || cat.categoryImage 
                      }
                      alt={toTitleCase(cat.name)}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{toTitleCase(cat.name).slice(0, 2)}</span>
                  )}
              </div>
              <span
                className={`mt-1 text-center block overflow-hidden text-ellipsis whitespace-nowrap ${parentCircleSize === "large" ? "text-base" : "text-xs"
                  }`}
                style={{
                  maxWidth: parentCircleSize === "large" ? "5rem" : "3.5rem",
                }}
                title={toTitleCase(cat.name)}
              >
                {toTitleCase(cat.name)}
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/20"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          <div
            className="absolute top-0 left-0 w-72 max-w-full h-full bg-white shadow-md p-4 z-[10000] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">All Categories</h3>
              <button
                onClick={onClose}
                aria-label="Close categories sidebar"
                className="text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="space-y-2 relative z-[10001]">
              {(categoryLevels[0] || []).map((cat) => (
                <AccordionItem
                  key={cat._id}
                  category={cat}
                  levelIndex={0}
                  handleCategoryClick={handleCategoryClick}
                  categoryLevels={categoryLevels}
                  categoriesByParentId={categoriesByParentId}
                  openIndexes={openIndexes}
                  setOpenIndexes={setOpenIndexes}
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
