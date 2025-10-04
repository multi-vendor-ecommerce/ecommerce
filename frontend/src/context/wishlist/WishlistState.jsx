import { useState } from "react";
import WishlistContext from "./WishlistContext";

const WishlistState = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-psww.onrender.com";
  // const host = "http://localhost:5000";

  // Fetch wishlist items
  const getWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/wishlist`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
      });
      const data = await res.json();

      if (data.success) {
        setWishlist(data.wishlist?.products || []);
      } else {
        console.warn(data.message);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    const token = localStorage.getItem("customerToken");

    if (!token) {
      return { success: false, message: "User not logged in" };
    }

    try {
      setLoading(true);
      const res = await fetch(`${host}/api/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (data.success) {
        setWishlist(data.wishlist.products);
      }
      return data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return { success: false, message: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/wishlist/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (data.success) {
        setWishlist(data.wishlist.products);
      }
      return data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return { success: false, message: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    const token = localStorage.getItem("customerToken");
    if (!token) return { success: false, message: "User not logged in" };

    setLoading(true);
    try {
      const res = await fetch(`${host}/api/wishlist`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const data = await res.json();
      if (data.success) {
        setWishlist([]); // clear local state as well
      }
      return data;
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      return { success: false, message: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistState;
