// WishlistButton.jsx
import React, { useContext, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import WishlistContext from "../../context/wishlist/WishlistContext";

const WishlistButton = ({ productId }) => {
  const { wishlist, addToWishlist, removeFromWishlist, getWishlist } =
    useContext(WishlistContext);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check on mount/update if product is already in wishlist
  useEffect(() => {
    if (wishlist && productId) {
      setIsInWishlist(wishlist.some((item) => item._id === productId));
    }
  }, [wishlist, productId]);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }

      await getWishlist();
    } catch (error) {
      console.error("Wishlist action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        background: "none",
        border: "none", 
        cursor: "pointer",
        fontSize: "1.5rem",
      }}
    >
      <FaHeart color={isInWishlist ? "red" : "gray"} />
    </button>
  );
};

export default WishlistButton;
