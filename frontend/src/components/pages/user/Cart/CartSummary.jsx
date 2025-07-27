// components/cart/CartSummary.jsx
import React from "react";

const CartSummary = ({ cart }) => {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  return (
    <div className="card p-3 shadow-sm">
      <h5>Summary</h5>
      <p>Total Items: {totalItems}</p>
      <h6>Total: ₹{totalPrice.toFixed(2)}</h6>
      <button className="btn btn-primary w-100 mt-3">Proceed to Checkout</button>
    </div>
  );
};

export default CartSummary;
