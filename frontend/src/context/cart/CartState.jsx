import { useState, useEffect } from "react";
import CartContext from "./CartContext";

const CartState = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const host = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // Fetching cart items
  const getCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/cart`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
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

  // Adding item to cart
  const addToCart = async (productId, quantity) => {
    try {
      setLoading(true);
      const res = await fetch(`${host}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  }

  // Removing item from cart
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${host}/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
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
      await fetch(`${host}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        }
      });
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }

  return (
    <CartContext.Provider value={{ cart, loading, getCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartState;

