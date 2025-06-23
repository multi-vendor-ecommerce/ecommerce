import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white p-3 rounded shadow hover:shadow-md transition">
      {/* 🛍️ Clickable area goes to detail page */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-contain mb-2"
        />
        <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
        <p className="text-user-primary font-bold">₹{product.price}</p>
      </Link>

      <button className="mt-2 w-full bg-user-primary text-white py-1 text-sm rounded hover:bg-user-secondary transition">
        Add to Cart
      </button>
    </div>
  );
}
