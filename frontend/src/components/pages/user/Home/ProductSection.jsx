import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductContext from "../../../../context/products/ProductContext";
import { encryptData } from "../Utils/Encryption";
import { FaStar } from "react-icons/fa";
import { getFinalPrice } from "../Utils/priceUtils";

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
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden mb-3 rounded-lg bg-gray-100">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/300"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 truncate">
                    {product.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 mt-1 leading-snug line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price and Discount */}
                  <div className="text-2xl font-bold text-[#7F55B1]">
                    ₹{getFinalPrice(product.price, product.discount).toLocaleString()}
                    {product.discount && product.discount > 0 && product.discount < 100 && (
                      <div className="text-sm text-gray-500 font-medium">
                        <span className="line-through mr-2">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-green-600 font-semibold">
                          ({product.discount}% OFF)
                        </span>
                      </div>
                    )}
                  </div>


                  {/* Colors (if any) */}
                  {product.colors?.length > 0 && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {product.colors.map((color, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full border border-gray-300 text-gray-700"
                          style={{ backgroundColor: color.toLowerCase(), color: 'white' }}
                          title={color}
                        >
                          {/* Just a colored circle */}
                          &nbsp;
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Sizes (if any) */}
                  {product.sizes?.length > 0 && (
                    <div className="mt-2 text-sm text-gray-700">
                      Sizes: <span className="font-semibold">{product.sizes.join(", ")}</span>
                    </div>
                  )}

                  {/* Rating */}
                  {/* <div className="text-sm md:text-lg text-yellow-600 font-medium mt-2 flex items-center gap-1">
                    {product.rating} <FaStar className="inline" />
                    <span className="text-gray-500 text-xs ml-1">
                      ({product.totalReviews?.toLocaleString() || 0} reviews)
                    </span>
                  </div> */}

                  {/* Free Delivery Tag */}
                  {product.freeDelivery && (
                    <div className="mt-2">
                      <span className="bg-green-100 text-green-700 text-xs md:text-sm px-2 py-1 rounded-full">
                        Free Delivery
                      </span>
                    </div>
                  )}
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
