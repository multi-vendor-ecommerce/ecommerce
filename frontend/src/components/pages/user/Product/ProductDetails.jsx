import React, { useContext, useEffect, useState } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import { decryptData } from "../Utils/Encryption";
import Spinner from "../../../common/Spinner";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { getProductById } = useContext(ProductContext);
  const [decryptedProductId, setDecryptedProductId] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const secretKey = import.meta.env.VITE_SECRET_KEY;

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const encodedProductId = parts[parts.length - 1];

    try {
      const decodedProductId = decodeURIComponent(decodeURIComponent(encodedProductId));
      const decryptedId = decryptData(decodedProductId, secretKey);
      setDecryptedProductId(decryptedId);
    } catch (error) {
      console.error("Error decoding or decrypting product ID:", error);
      setLoading(false);
    }
  }, [secretKey]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (decryptedProductId) {
        setLoading(true);
        const product = await getProductById(decryptedProductId);
        setProductDetails(product);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [decryptedProductId, getProductById]);

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  if (!productDetails) {
    return (
      <div className="p-4 text-center text-gray-500">
        Product not found or failed to load.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: IMAGE */}
        <div className="p-6 bg-gray-100 flex items-center justify-center">
          <img
            src={productDetails.images?.[0] || "https://via.placeholder.com/600"}
            alt={productDetails.title}
            className="max-h-[500px] w-full object-contain rounded-lg"
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{productDetails.title}</h1>
          
          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 text-yellow-500 text-sm">
            <span className="font-semibold text-black">{productDetails.rating} ★</span>
            <span className="text-gray-500">({productDetails.totalReviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-pink-600">₹{productDetails.price}</div>

          {/* Free Delivery */}
          {productDetails.freeDelivery && (
            <div className="text-green-600 font-medium text-sm">✅ Free Delivery</div>
          )}

          {/* Stock Status */}
          <div>
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                productDetails.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}
            >
              {productDetails.stock > 0
                ? `In Stock (${productDetails.stock})`
                : "Out of Stock"}
            </span>
          </div>

          {/* Units Sold & Revenue */}
          <p className="text-sm text-gray-500">
            Sold: <strong>{productDetails.unitsSold}</strong> · Revenue: ₹{productDetails.totalRevenue.toLocaleString()}
          </p>

          {/* Category */}
          <p className="text-sm text-gray-500">
            Category: <strong>{productDetails.category?.name}</strong>
          </p>

          {/* Tags */}
          {productDetails.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {productDetails.tags.map((tag, i) => (
                <span key={i} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md">{tag}</span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-700 text-sm mt-4">{productDetails.description}</p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg shadow transition"
              onClick={() => alert("Buy Now clicked!")}
            >
              Buy Now
            </button>
            <button
              className="bg-white border border-pink-600 text-pink-600 px-6 py-2 rounded-lg shadow hover:bg-pink-50 transition"
              onClick={() => alert("Added to Cart!")}
            >
              Add to Cart
            </button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-block text-sm text-gray-500 hover:underline"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
