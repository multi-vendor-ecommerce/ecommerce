import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryContext from "../../../../context/categories/CategoryContext";
import Spinner from "../../../common/Spinner";
import { encryptData } from "../Utils/Encryption";

export default function CategorySection() {
  const { categories, loading, getAllCategories } = useContext(CategoryContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      await getAllCategories();
      setIsLoaded(true);
    };
    fetchCategories();
  }, []);

  const handleNavigate = (id) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const encryptedId = encryptData(id, secretKey);
    navigateTo(`product/category/${encodeURIComponent(encryptedId)}`);
  };

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-50 flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  return (
    <div className="py-2 sm:py-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xl md:text-2xl font-semibold py-4 text-gray-700">Shop by Categories</p>

        {!isLoaded || loading ? (
          <p className="text-sm text-gray-500">Loading categories...</p>
        ) : Array.isArray(categories) && categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories available.</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="flex gap-10 py-0 scrollbar-hide">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => handleNavigate(cat._id)}
                  className="cursor-pointer flex-shrink-0 w-20 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-1 text-xs font-medium text-gray-700 truncate w-full">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
