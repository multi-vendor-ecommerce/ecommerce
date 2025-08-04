import { useEffect, useState, useContext } from "react";
import CategoryContext from "../../../../../context/categories/CategoryContext";

const CategorySelector = ({
  selectedCategories,
  setSelectedCategories,
  formData,
  setFormData,
  onCategoryFinalSelect
}) => {
  const { categoriesByParentId } = useContext(CategoryContext);
  const [categoryLevels, setCategoryLevels] = useState([]);

  useEffect(() => {
    loadCategories(null, 0);
  }, []);

  const loadCategories = async (parentId = null, index = 0) => {
    const newCategories = await categoriesByParentId(parentId);
    if (!newCategories || newCategories.length === 0) {
      setCategoryLevels((prev) => prev.slice(0, index + 1));
      setSelectedCategories((prev) => prev.slice(0, index + 1));
      return;
    }
    const updatedLevels = [...categoryLevels.slice(0, index + 1), newCategories];
    setCategoryLevels(updatedLevels);
    setSelectedCategories((prev) => prev.slice(0, index + 1));
  };

  const handleCategoryClick = async (categoryId, levelIndex) => {
    // Trim levels and selections after current level
    const newSelections = [...selectedCategories.slice(0, levelIndex), categoryId];
    const newLevels = [...categoryLevels.slice(0, levelIndex + 1)];

    setSelectedCategories(newSelections);
    setCategoryLevels(newLevels);

    // Fetch children of selected category
    const children = await categoriesByParentId(categoryId);
    if (children.length > 0) {
      setCategoryLevels((prev) => [...newLevels, children]);
    }

    // Update selected category in form
    onCategoryFinalSelect(categoryId); // Notify parent
  };

  const getSelectedCategoryPath = () => {
    return selectedCategories
      .map((id, levelIndex) => {
        const level = categoryLevels[levelIndex];
        const match = level?.find((cat) => cat._id === id);
        return match?.name || "";
      })
      .join(" / ");
  };

  return (
    <div className="w-full flex flex-wrap gap-4 overflow-x-auto pb-2">
      {categoryLevels.map((level, levelIndex) => (
        <div
          key={levelIndex}
          className="min-w-full md:min-w-[200px] md:max-h-[300px] overflow-y-auto rounded-lg shadow-md shadow-purple-500 bg-gray-50 p-2 break-words"
        >
          <h3 className="text-sm md:text-[16px] font-semibold mb-2 text-gray-600">
            Level {levelIndex + 1}
          </h3>
          {level.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleCategoryClick(cat._id, levelIndex)}
              className={`cursor-pointer px-3 py-2 my-1 rounded-lg transition ${selectedCategories[levelIndex] === cat._id
                ? "bg-blue-200 font-semibold"
                : "hover:bg-blue-100"
                }`}
            >
              - {cat.name}
            </div>
          ))}
        </div>
      ))}

      {formData.category && (
        <div className="min-w-full md:min-w-[250px] max-w-sm px-3 py-2 rounded-lg shadow-md shadow-purple-500 bg-gray-50 break-words">
          <h3 className="font-bold text-gray-800 mb-2">Selected Category</h3>
          <p className="text-gray-600 text-sm md:text-[16px]">{getSelectedCategoryPath()}</p>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
