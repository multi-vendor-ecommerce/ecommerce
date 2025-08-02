import { useState } from "react";
import CategoryContext from "./CategoryContext";

const CategoryState = (props) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesByLevel, setCategoriesByLevel] = useState({});

  // const host = import.meta.env.VITE_BACKEND_URL;
  const host = "http://localhost:5000";

  const getAllCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${host}/api/categories/allCategory`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories.');
      }

      const data = await response.json();

      if (data && data.categories) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }

    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriesByParent = async (parentId = null) => {
    const cacheKey = `parent-${parentId || "root"}`;

    // Return from cache if already fetched
    if (categoriesByLevel[cacheKey]) {
      return categoriesByLevel[cacheKey];
    }

    try {
      const res = await fetch(`${host}/api/categories?parentId=${parentId || ""}`);
      const data = await res.json();

      if (data.success) {
        setCategoriesByLevel((prev) => ({
          ...prev,
          [cacheKey]: data.categories,
        }));
        return data.categories;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching categories by parent", error);
      return [];
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, getAllCategories, getCategoriesByParent, }}>
      {props.children}
    </CategoryContext.Provider>
  )
}

export default CategoryState;