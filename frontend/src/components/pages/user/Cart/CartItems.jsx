import React, { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import cartData from "../Utils/CardItems";

export default function CartItems() {
  const [items, setItems] = useState(cartData);

  const increment = (id) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setItems(updated);
  };

  const decrement = (id) => {
    const updated = items.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setItems(updated);
  };

  const removeItem = (id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center bg-white p-4 rounded shadow justify-between">
          <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />

          <div className="flex-1 px-4">
            <h4 className="font-semibold text-user-dark">{item.name}</h4>
            <p className="text-user-primary font-bold">₹{item.price}</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => decrement(item.id)} className="bg-user-base px-2 py-1 rounded">
              <FaMinus />
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => increment(item.id)} className="bg-user-base px-2 py-1 rounded">
              <FaPlus />
            </button>
          </div>

          <button onClick={() => removeItem(item.id)} className="ml-4 text-red-600">
            <FaTrash />
          </button>
        </div>
      ))}

      {items.length === 0 && (
        <p className="text-center text-user-dark">Your cart is empty 🛒</p>
      )}
    </div>
  );
}
