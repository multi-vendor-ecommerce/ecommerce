import React, { useState } from "react";
import wishlistData from "../../../data/wishlistData";
import { addToCart } from "../../../utils/cartUtils";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(wishlistData);

  const handleRemove = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    handleRemove(product.id);
    alert(`${product.name} moved to cart 💜`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-user-primary mb-6">
        My Wishlist 💖
      </h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-contain mb-2"
              />
              <h4 className="font-semibold text-sm line-clamp-1">
                {product.name}
              </h4>
              <p className="text-user-primary font-bold">₹{product.price}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="bg-user-primary text-white px-3 py-1 text-sm rounded hover:bg-user-secondary"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="text-red-500 text-sm"
                >
                  Remove ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
