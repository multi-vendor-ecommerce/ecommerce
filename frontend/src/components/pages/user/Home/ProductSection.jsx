import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductContext from "../../../../context/products/ProductContext";
import { encryptData } from "../Utils/Encryption";

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
    <div className="bg-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-semibold py-4 text-gray-700 text-start"> Products for you
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-3 border border-gray-100 flex flex-col"
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-2">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/300"}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h3 className="font-semibold text-sm sm:text-md text-gray-900 truncate">
                    {product.title}
                  </h3>

                  <p className="text-sm sm:text-md text-gray-500 leading-tight line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[#7F55B1] font-bold text-lg ">₹{product.price}</span>
                    <span className="text-sm sm:text-lg text-yellow-600 font-medium">
                      {product.rating} ★
                    </span>
                  </div>


                  <div className="flex justify-between items-center mt-1">
                    {product.freeDelivery && (
                      <span className="bg-green-100 text-green-700 text-[13px] px-1.5 py-0.5 rounded">
                        Free Delivery
                      </span>
                    )}
                    <span
                      className={`text-[13px] font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="mt-1 flex justify-between text-[13px] text-gray-400">
                    <span>{product.category?.name}</span>
                    {product.unitsSold > 50 && <span>{product.unitsSold} sold</span>}
                  </div>
                </div>

              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No products found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
