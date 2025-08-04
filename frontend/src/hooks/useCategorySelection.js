// hooks/useCategorySelection.js
import { useContext, useState } from "react";
import CategoryContext from "../context/categories/CategoryContext";

const useCategorySelection = (
  onCategoryFinalSelect = () => {},
  setSelectedCategories = null,
  selectedCategories = []
) => {
  const { categoriesByParentId } = useContext(CategoryContext);
  const [categoryLevels, setCategoryLevels] = useState([]);

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

  return {
    categoryLevels,
    selectedCategories,
    setSelectedCategories,
    loadCategories,
    handleCategoryClick,
    getSelectedCategoryPath,
  };
};

export default useCategorySelection;
