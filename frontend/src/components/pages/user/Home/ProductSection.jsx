import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductContext from "../../../../context/products/ProductContext";
import { encryptData } from "../Utils/Encryption";
import { FaStar } from "react-icons/fa";

export default function ProductSection({ title }) {
  const { products, loading, getAllProducts } = useContext(ProductContext);
  const navigateTo = useNavigate();

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleProductClick = (productId) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const encryptedProductId = encryptData(productId, secretKey);
    navigateTo(`product/${encodeURIComponent(encryptedProductId)}`);
  };

  return (
    <div className="bg-[#F9F7FC] py-4">
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold py-4 text-gray-800 text-start">
          Products for you
        </h2>

        {loading ? (
          <p className="text-lg text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 border border-gray-100 flex flex-col"
                >
                  <div className="aspect-square  overflow-hidden mb-3">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/300"}
                      alt={product.title}
                      className="w-full h-full object-cover bg-gray-100"
                    />
                  </div>

                  <h3 className="font-semibold text-base md:text-lg text-gray-900 truncate">
                    {product.title}
                  </h3>

                  <p className="text-sm md:text-base text-gray-600 mt-1 leading-snug line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-2">
                    {product.discountPercentage ? (
                      <>
                        <div className="text-[#7F55B1] font-bold text-lg md:text-xl">
                          ₹{(product.price - (product.price * product.discountPrice / 100)).toFixed(0)}
                        </div>

                        <div className="text-gray-400 text-sm md:text-base line-through">
                          ₹{product.price}
                        </div>
                      </>
                    ) : (
                      <div className="text-[#7F55B1] font-bold text-lg md:text-xl">
                        ₹{product.price}
                      </div>
                    )}

                    {product.discountPercentage && (
                      <div className="text-green-600 text-xs font-semibold mt-1">
                        {product.discountPrice }% OFF
                      </div>
                    )}

                  </div>

                  <div className="text-sm md:text-lg text-yellow-600 font-medium mt-1 flex items-center gap-1">
                    {product.rating} <FaStar className="inline" />
                  </div>


                  <div className="flex justify-between items-center mt-2">
                    {product.freeDelivery && (
                      <span className="bg-green-100 text-green-700 text-xs md:text-sm px-2 py-1 rounded-full">
                        Free Delivery
                      </span>
                    )}
                    {/* <span
                      className={`text-xs md:text-sm font-medium ${product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span> */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-500 col-span-full text-center">
                No products found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
