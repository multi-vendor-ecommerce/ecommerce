import { useEffect, useState, useContext } from "react";
import { decryptData, encryptData } from "../Utils/Encryption";
import ProductContext from "../../../../context/products/ProductContext";
import Spinner from "../../../common/Spinner";
import { useNavigate } from "react-router-dom";

export default function ProductByCategory() {
  const { getProductsByCategoryId } = useContext(ProductContext);

  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const [decryptedURLId, setDecryptedURLId] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const navigateTo = useNavigate();

  // Decrypt category ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const encodedUrlId = parts[parts.length - 1];

    try {
      const decodedUrlId = decodeURIComponent(decodeURIComponent(encodedUrlId));
      const decryptedId = decryptData(decodedUrlId, secretKey);
      setDecryptedURLId(decryptedId);
    } catch (error) {
      console.error("Error while decoding or decrypting:", error);
      setProductsLoading(false);
    }
  }, [secretKey]);

  // Fetch products based on decrypted category ID
  useEffect(() => {
    const fetchProducts = async () => {
      if (decryptedURLId) {
        setProductsLoading(true);
        const products = await getProductsByCategoryId(decryptedURLId);
        setCategoryProducts(products || []);
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [decryptedURLId, getProductsByCategoryId]);

  // Navigate to encrypted product details page
  const handleProductClick = (productId) => {
    const encryptedProductId = encryptData(productId, secretKey);
    navigateTo(`/product/${encodeURIComponent(encryptedProductId)}`);
  };

  // Navigate to previous state 
  const handleBack = () => {
    if (window.history.length > 1) {
      navigateTo(-1);
    } else {
      navigateTo("/");
    }
  };

  if (productsLoading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  return (
    <div className="bg-[#F9F7FC]">
      <div className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#F9F7FC]">
        {/* <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-600">Category Products</h2> */}
        <button
          onClick={() => handleBack(-1)}
          className="mb-6 inline-flex items-center gap-1 text-sm sm:text-base md:text-lg font-medium text-gray-600 hover:text-gray-800 hover:underline transition duration-200"
        >
          <span className="text-lg">←</span> Back to Products
        </button>

        {categoryProducts.length > 0 ? (
          <div className="grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {categoryProducts.map((product) => (
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

                <h3 className="font-semibold text-sm sm:text-lg text-gray-900 truncate">
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

                {/* <div className="mt-1 flex justify-between text-[13px] text-gray-400">
                  <span>{product.category?.name}</span>
                  {product.unitsSold > 50 && <span>{product.unitsSold} sold</span>}
                </div> */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found in this category.</p>
        )}
      </div>
    </div>
  );
}
