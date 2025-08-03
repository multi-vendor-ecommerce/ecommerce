import { useState, useEffect } from "react";
import CartContext from "./CartContext";

const CartState = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const host = import.meta.env.VITE_BACKEND_URL;
  // const host = "http://localhost:5000";
  const token = localStorage.getItem("customerToken");

  // Fetching cart items
  const getCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/cart`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        }
      });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }

  // + , - , Add item to cart
  const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem("customerToken");
    if (!productId || typeof quantity !== "number") {
      console.error("Invalid productId or quantity");
      return { success: false, message: "Invalid input" };
    }

    try {
      setLoading(true);
      const res = await fetch(`${host}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (data.success) {
        setCart(data.cart); 
      } else {
        console.warn("Add to cart failed:", data.message);
      }

      return data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, message: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  // Removing item from cart
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${host}/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        }
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }

    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  }

  // clear all cart items (this function is not defined in the backend yet, but can be added if needed)
  const clearCart = async () => {
    try {
      await fetch(`${host}/api/cart/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        }
      });
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }

  return (
    <CartContext.Provider value={{ cart,token, loading, getCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartState;

