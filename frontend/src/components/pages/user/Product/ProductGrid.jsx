import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../Utils/Encryption";
import { getFinalPrice } from "../Utils/priceUtils";
import WishlistButton from "../../../common/WishlistButton";

export default function ProductGrid({ products, secretKey }) {
  const navigateTo = useNavigate();

  const handleProductClick = (productId) => {
    const encryptedProductId = encryptData(productId, secretKey);
    navigateTo(`/product/${encodeURIComponent(encryptedProductId)}`);
  };

  if (!products?.length) {
    return (
      <p className="text-lg text-gray-500 col-span-full text-center mt-10">
        No products found.
      </p>
    );F
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {products.map((product) => (
        <div
          key={product._id}
          className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-500 flex flex-col relative"
        >
          <div
            className="aspect-square rounded-t-xl overflow-hidden bg-gray-50 relative"
            onClick={() => handleProductClick(product._id)}
          >
            <img
              src={product.images?.[0].url || "https://via.placeholder.com/300"}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            <div
              className="absolute top-2 right-2 z-10"
              onClick={(e) => e.stopPropagation()} 
            >
              <WishlistButton productId={product._id} />
            </div>
          </div>

          {/* Product Content */}
          <div className="flex flex-col flex-grow p-4">
            <h3
              className="font-semibold text-base sm:text-lg text-gray-900 truncate cursor-pointer"
              onClick={() => handleProductClick(product._id)}
            >
              {product.title}
            </h3>

            <p className="text-sm sm:text-base text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>

            {/* Read More link */}
            <button
              className="mt-1 text-sm text-purple-700 font-semibold hover:underline self-start"
              onClick={() => handleProductClick(product._id)}
              aria-label={`Read more about ${product.title}`}
            >
              Read more
            </button>

            <div className="mt-3 flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-[#7F55B1]">
                  ₹{getFinalPrice(product.price, product.discount).toLocaleString()}
                </span>
                {typeof product.discount === "number" &&
                  product.discount > 0 &&
                  product.discount < 100 && (
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

              <div className="flex items-center text-yellow-600 font-medium text-sm sm:text-base">
                {product.rating} <FaStar className="ml-1" />
                <span className="text-gray-500 text-xs sm:text-sm ml-2">
                  ({product.totalReviews?.toLocaleString() || 0})
                </span>
              </div>
            </div>

            {product.colors?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {product.colors.map((color, i) => (
                  <span
                    key={i}
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            )}

            <div className="mt-3 flex justify-between items-center text-xs sm:text-sm">
              {product.freeDelivery && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Free Delivery
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}