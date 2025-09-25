import React, { useContext, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import WishlistContext from "../../../../context/wishlist/WishlistContext";
import { encryptData } from "../Utils/Encryption";
import BackButton from "../../../common/layout/BackButton";
import Loader from "../../../common/Loader";
import Button from "../../../common/Button";
import { FiTrash2, FiX } from "react-icons/fi";

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
      <div className="flex min-h-screen justify-center items-center">
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
    <div className="w-full mx-auto py-8 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <BackButton className="border-green-500 hover:bg-green-700" />
        
        <Button
          icon={FiTrash2}
          text="Remove All"
          onClick={handleClearAll}
          color="red"
          className="py-2"
        />
      </div>

      <h2 className="text-2xl font-bold text-green-700 mb-6">My Wishlist</h2>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="w-full bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-green-600 transition duration-200 flex flex-col items-center md:items-start gap-4"
          >
            <div className="flex justify-between items-start gap-2 w-full">
              <img
                src={product.images?.[0]?.url || "/default-product.png"}
                alt={product.title}
                className="w-28 h-28 object-cover rounded cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              />
              <div className="w-[80%] flex flex-col flex-1">
                <h3
                  className="font-semibold text-lg cursor-pointer text-green-700 hover:text-green-900 truncate"
                  onClick={() => handleProductClick(product?._id)}
                >
                  {product?.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">{product?.description}</p>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="mt-3 flex items-center justify-between w-full">
                <span className="text-base md:text-lg font-semibold">
                  Price:{" "}
                  <span className="text-green-700">₹{(product?.price).toLocaleString()}</span>
                </span>

                <Button
                  icon={FiX}
                  text="Remove"
                  onClick={() => handleRemove(product?._id)}
                  className="py-1.5"
                  color="red"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
