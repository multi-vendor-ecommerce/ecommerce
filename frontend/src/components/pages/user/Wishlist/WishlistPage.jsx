import React, { useContext, useEffect } from "react";
import WishlistContext from "../../../../context/wishlist/WishlistContext";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../Utils/Encryption";
import Spinner from "../../../common/Spinner";
import { NavLink } from "react-router-dom";

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

    if (loading) {
        return <div className="flex min-h-screen justify-center items-center">
            <Spinner />
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4 bg-white max-w-md mx-auto">
                    <p className="text-xl font-semibold text-gray-700">Your Wishlist is empty</p>
                    <NavLink
                        to="/"
                        className="inline-block px-6 py-3 bg-[#7F55B1] text-white font-medium rounded-md  transition-colors duration-300 "
                    >
                        Add Now
                    </NavLink>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((product) => (
                        <div
                            key={product._id}
                            className="border rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm bg-white"
                        >
                            <img
                                src={product.images?.[0]?.url || "/default-product.png"}
                                alt={product.title}
                                className="w-24 h-24 object-cover rounded"
                                onClick={() => handleProductClick(product._id)}
                                style={{ cursor: "pointer" }}
                            />
                            <div className="flex-1">
                                <h3
                                    className="font-semibold text-lg cursor-pointer hover:text-purple-700"
                                    onClick={() => handleProductClick(product._id)}
                                >
                                    {product.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                                <div className="mt-2 flex items-center gap-4">
                                    <span className="font-bold text-purple-700">₹{product.price}</span>
                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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