// components/cart/CartItem.jsx
import React from "react";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="d-flex justify-content-between align-items-center border-bottom py-3">
      <div className="d-flex gap-3 align-items-center">
        <img src={item.product.image} alt={item.product.name} width="70" height="70" className="rounded" />
        <div>
          <h5 className="mb-1">{item.product.name}</h5>
          <p className="mb-1">₹{item.product.price}</p>
          <div className="input-group input-group-sm w-50">
            <button className="btn btn-outline-secondary" onClick={() => onQuantityChange(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
            <input type="text" value={item.quantity} readOnly className="form-control text-center" />
            <button className="btn btn-outline-secondary" onClick={() => onQuantityChange(item.product._id, item.quantity + 1)}>+</button>
          </div>
        </div>
      </div>
      <div>
        <button className="btn btn-sm btn-danger" onClick={() => onRemove(item.product._id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
