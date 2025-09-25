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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 my-4 mx-2">
      {products.map((product) => (
        <div
          key={product._id}
          className="group cursor-pointer mx-2 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:scale-105
                     transition-all duration-300 border border-gray-200 hover:border-green-500 
                     flex flex-col relative overflow-hidden"
        >
          {/* Product Image with fixed aspect ratio */}
          <div
            className="aspect-[4/3] rounded-t-2xl overflow-hidden relative"
            onClick={() => handleProductClick(product._id)}
          >
            <img
              src={product.images?.[0].url || "https://via.placeholder.com/300"}
              alt={product.title}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            <div
              className="absolute top-3 right-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <WishlistButton productId={product._id} />
            </div>
          </div>

          {/* Product Content */}
          <div className="flex flex-col flex-grow p-4">
            <h3
              className="font-semibold text-base sm:text-lg text-gray-900 truncate cursor-pointer group-hover:text-green-600 transition-colors"
              onClick={() => handleProductClick(product._id)}
            >
              {product.title}
            </h3>

            <p className="text-sm sm:text-base text-gray-500 mt-1 line-clamp-2">
              <span dangerouslySetInnerHTML={{ __html: product?.description || "No description provided." }} />
            </p>

            {/* Read More link */}
            <button
              className="mt-1 text-sm text-purple-700 font-semibold hover:underline self-start cursor-pointer"
              onClick={() => handleProductClick(product._id)}
              title="Read more"
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
                    className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            )}

            <div className="mt-3 flex justify-between items-center text-xs sm:text-sm">
              {product.freeDelivery && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium shadow-sm">
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