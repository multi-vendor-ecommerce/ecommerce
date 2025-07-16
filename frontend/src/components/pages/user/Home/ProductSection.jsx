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
    console.log("Product clicked:", productId);
    console.log("Encrypted Product ID: ", encryptedProductId);
    navigateTo(`product/${encodeURIComponent(encryptedProductId)}`);
  };

  return (
    <div className="py-0 bg-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold py-4 text-gray-800">Products for you</h2>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-3"
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-base text-gray-900 truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-bold text-gray-800">
                        ₹{product.price}
                      </span>
                    </div>
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
