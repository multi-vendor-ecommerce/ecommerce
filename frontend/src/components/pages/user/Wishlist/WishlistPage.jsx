import React, { useContext, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import WishlistContext from "../../../../context/wishlist/WishlistContext";
import { encryptData } from "../Utils/Encryption";
import Loader from "../../../common/Loader";

const WishlistPage = () => {
  const { wishlist, getWishlist, removeFromWishlist, clearWishlist, loading } = useContext(WishlistContext);
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      await getWishlist();
      setLocalLoading(false);
    };
    fetchWishlist();
  }, []);

  const handleProductClick = (productId) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const encryptedProductId = encryptData(productId, secretKey);
    navigate(`/product/${encodeURIComponent(encryptedProductId)}`);
  };

  const handleRemove = async (productId) => {
    setLocalLoading(true);
    await removeFromWishlist(productId);
    setLocalLoading(false);
  };

  const handleClearAll = async () => {
    setLocalLoading(true);
    await clearWishlist();
    setLocalLoading(false);
  };

  if (loading || localLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-green-50">
        <Loader />
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 min-h-screen bg-green-50 text-center space-y-4">
        <p className="text-xl font-semibold text-green-700">Your Wishlist is empty</p>
        <NavLink
          to="/"
          className="px-6 py-3 bg-green-900 text-white rounded-lg font-medium hover:bg-green-700 transition"
        >
          Add Products
        </NavLink>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8 px-4 bg-green-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">My Wishlist</h2>
        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col items-center md:items-start gap-4"
          >
            <img
              src={product.images?.[0]?.url || "/default-product.png"}
              alt={product.title}
              className="w-28 h-28 object-cover rounded cursor-pointer"
              onClick={() => handleProductClick(product._id)}
            />
            <div className="flex-1 w-full">
              <h3
                className="font-semibold text-lg cursor-pointer text-green-700 hover:text-green-900 truncate"
                onClick={() => handleProductClick(product._id)}
              >
                {product.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              <div className="mt-3 flex items-center justify-between w-full">
                <span className="font-bold text-green-700">₹{product.price}</span>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
