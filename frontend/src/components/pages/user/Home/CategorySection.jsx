import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryContext from "../../../../context/categories/CategoryContext";
import Spinner from "../../../common/Spinner";
import { encryptData } from "../Utils/Encryption";

export default function CategorySection() {
  const { categories, loading, getAllCategories } = useContext(CategoryContext);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      await getAllCategories();
      setIsLoaded(true);
    };
    fetchCategories();
  }, []);

  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const navigateTo = useNavigate();

  const handleNavigate = (id) => {
    const encryptedId = encryptData(id, secretKey);
    navigateTo(`product/category/${encodeURIComponent(encryptedId)}`);
  };

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  return (
    <div className="px-4 py-4 bg-white shadow w-full">
      <p className="text-lg mb-3 font-semibold text-start">Shop by Categories</p>

      {/* Loading state */}
      {!isLoaded || loading ? (
        <p className="text-sm text-gray-500">Loading categories...</p>

      ) : Array.isArray(categories) && categories.length === 0 ? (
        <p className="text-sm text-gray-500">No categories available.</p>

      ) : (
        <div className="w-full overflow-x-auto">
          <div className="flex gap-4 py-4 lg:mx-auto align-items-center scrollbar-hide">
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => handleNavigate(cat._id)}
                className="cursor-pointer flex-shrink-0 w-20 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-1 text-xs font-medium text-user-dark truncate w-full">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
