// WishlistButton.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import WishlistContext from "../../context/wishlist/WishlistContext";

const WishlistButton = ({ productId }) => {
  const { wishlist, addToWishlist, removeFromWishlist, getWishlist } =
    useContext(WishlistContext);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Check on mount/update if product is already in wishlist
  useEffect(() => {
    if (wishlist && productId) {
      setIsInWishlist(wishlist.some((item) => item._id === productId));
    }
  }, [wishlist, productId]);

  const handleClick = async () => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      navigate(`/login/user?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }
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
    // <button
    //   onClick={handleClick}
    //   disabled={loading}
    //   style={{
    //     background: "none",
    //     border: "none",
    //     cursor: "pointer",
    //     fontSize: "1.5rem",
    //   }}
    // >
    //   <FaHeart color={isInWishlist ? "red" : "gray"} />
    // </button>
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        background: "white",
        border: "1px solid #e5e7eb", // light gray border
        borderRadius: "50%", // round button
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "1.5rem",
        padding: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        opacity: loading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
      }}
    >
      <FaHeart color={isInWishlist ? "red" : "#6b7280"} /> {/* gray-500 */}
    </button>

  );
};

export default WishlistButton;
