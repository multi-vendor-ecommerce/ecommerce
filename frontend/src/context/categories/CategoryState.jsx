import { useState, useCallback } from "react";
import CategoryContext from "./CategoryContext";

const CategoryState = (props) => {
  const [loading, setLoading] = useState(false);
  const [categoriesByLevel, setCategoriesByLevel] = useState({});

  const host = import.meta.env.VITE_BACKEND_URL;
  // const host = "http://localhost:5000";

  //  CREATE CATEGORY - Admin 
  const createCategory = async (formData) => {
    try {
      setLoading(true);

      const res = await fetch(`${host}/api/categories`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("adminToken"),
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Invalidate cache for parent (if included in formData)
        const parent = formData.get("parent");
        const cacheKey = `parent-${parent || "root"}`;
        setCategoriesByLevel((prev) => {
          const updated = { ...prev };
          delete updated[cacheKey];
          return updated;
        });

        return { success: true, category: data.category, message: data.message || "Category created successfully" };
      } else {
        return { success: false, message: data.message || "Failed to create category" };
      }
    } catch (error) {
      console.error("Error creating category:", error);
      return { success: false, message: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  const categoriesByParentId = useCallback(async (parentId = null) => {
    const cacheKey = `parent-${parentId || "root"}`;

    if (categoriesByLevel[cacheKey]) {
      return categoriesByLevel[cacheKey];
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${host}/api/categories${parentId ? `?parentId=${parentId}` : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setCategoriesByLevel((prev) => ({
          ...prev,
          [cacheKey]: data.categories,
        }));
        return data.categories;
      } else {
        console.error("Error fetching categories:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      return [];
    }
  }, [categoriesByLevel, host]);

  return (
    <CategoryContext.Provider
      value={{
        categoriesByParentId,
        createCategory,
        loading,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;