import React, { useState, useContext } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import CategoryContext from "../../../../context/categories/CategoryContext";

const ProductCategoryFilter = ({
  onPriceChange,
  onRatingChange,
  onCategoryChange,
  selectedCategories = [],
  priceRange = [100, 100000],
  selectedRatings = [],
}) => {
  const { categoriesByParentId, loading } = useContext(CategoryContext);
  const [categories, setCategories] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
  });

  // Fetch top-level categories on mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      const data = await categoriesByParentId(null);
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    if (onCategoryChange) {
      const newSelected = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      onCategoryChange(newSelected);
    }
  };

  const handlePriceChange = (type, value) => {
    if (onPriceChange) {
      const newRange = [...priceRange];
      if (type === 'min') newRange[0] = Number(value);
      if (type === 'max') newRange[1] = Number(value);
      onPriceChange(newRange);
    }
  };

  const handleRatingToggle = (rating) => {
    if (onRatingChange) {
      const newSelected = selectedRatings.includes(rating)
        ? selectedRatings.filter(r => r !== rating)
        : [...selectedRatings, rating];
      onRatingChange(newSelected);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 space-y-6">
      {/* Categories Section */}
      <div className="border-b pb-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('categories')}
        >
          <h3 className="font-bold text-lg">PRODUCT CATEGORIES</h3>
          {expandedSections.categories ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
        
        {expandedSections.categories && (
          <div className="mt-3 space-y-2">
            {loading && !categories.length ? (
              <div>Loading...</div>
            ) : (
              categories.map(category => (
                <div key={category._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`cat-${category._id}`}
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryToggle(category._id)}
                    className="mr-2"
                  />
                  <label htmlFor={`cat-${category._id}`}>{category.name}</label>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Price Filter Section */}
      <div className="border-b pb-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('price')}
        >
          <h3 className="font-bold text-lg">FILTER BY PRICE</h3>
          {expandedSections.price ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
        
        {expandedSections.price && (
          <div className="mt-3">
            <div className="flex justify-between mb-2">
              <div className="w-5/12">
                <label className="block text-sm text-gray-600 mb-1">From:</label>
                <div className="flex items-center border rounded">
                  <span className="px-2">Rs:</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full py-1 px-2 focus:outline-none"
                    min="0"
                  />
                </div>
              </div>
              <div className="w-5/12">
                <label className="block text-sm text-gray-600 mb-1">To:</label>
                <div className="flex items-center border rounded">
                  <span className="px-2">Rs:</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full py-1 px-2 focus:outline-none"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter Section */}
      <div className="border-b pb-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('rating')}
        >
          <h3 className="font-bold text-lg">FILTER BY RATING</h3>
          {expandedSections.rating ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
        
        {expandedSections.rating && (
          <div className="mt-3 space-y-2">
            {[5, 4, 3, 2].map(rating => (
              <div key={rating} className="flex items-center">
                <input
                  type="checkbox"
                  id={`rating-${rating}`}
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingToggle(rating)}
                  className="mr-2"
                />
                <label htmlFor={`rating-${rating}`} className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      {i < rating ? '★' : '☆'}
                    </span>
                  ))}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategoryFilter;