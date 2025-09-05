import React, { useContext, useEffect, useState } from "react";
import WishlistContext from "../../../../context/wishlist/WishlistContext";
import { useNavigate, NavLink } from "react-router-dom";
import { encryptData } from "../Utils/Encryption";
import Spinner from "../../../common/Spinner";

const WishlistPage = () => {
    const { wishlist, getWishlist, removeFromWishlist, loading } = useContext(WishlistContext);
    const navigate = useNavigate();

    useEffect(() => {
        getWishlist();
    }, []);

    const handleProductClick = (productId) => {
        const secretKey = import.meta.env.VITE_SECRET_KEY;
        const encryptedProductId = encryptData(productId, secretKey);
        navigate(`/product/${encodeURIComponent(encryptedProductId)}`);
    };

    const handleremoveFromWishlists = (productId) => {
        removeFromWishlist(productId)
    }

    if (loading) {
        return (
            <div className="flex min-h-screen justify-center items-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-8 px-4 bg-green-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-green-700">My Wishlist</h2> 

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4 bg-white max-w-md mx-auto rounded-lg shadow-md">
                    <p className="text-xl font-semibold text-gray-700">Your Wishlist is empty</p>
                    <NavLink
                        to="/"
                        className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-300"
                    >
                        Add Now
                    </NavLink>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlist.map((product) => (
                        <div
                            key={product._id}
                            className=" rounded-lg p-4 flex flex-col items-center md:items-start gap-4 shadow-sm bg-white hover:shadow-md transition"
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
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="font-bold text-green-700">₹{product.price}</span>
                                    <button
                                        onClick={() => handleremoveFromWishlists(product._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
