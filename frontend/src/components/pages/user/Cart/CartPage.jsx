// components/cart/CartPage.jsx
import React, { useContext, useEffect } from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartContext from "../../../../context/cart/CartContext";

const CartPage = () => {
  const { cart, getCart, loading, updateCartItemQuantity, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    getCart();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity >= 0) {
      updateCartItemQuantity(productId, quantity);
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  if (loading) return <div className="text-center mt-5">Loading cart...</div>;
  if (cart.length === 0) return <div className="text-center mt-5">Your cart is empty 🛒</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Cart</h2>
      <div className="row">
        <div className="col-md-8">
          {cart.map(item => (
            <CartItem
              key={item.product._id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
        </div>
        <div className="col-md-4">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
