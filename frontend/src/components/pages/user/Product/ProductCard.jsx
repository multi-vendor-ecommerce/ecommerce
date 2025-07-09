import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../Cart/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="relative bg-white p-3 rounded shadow hover:shadow-md transition">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-contain mb-2"
        />
        <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
        <p className="text-user-primary font-bold">₹{product.price}</p>
      </Link>

      <button
        className="mt-2 w-full bg-user-primary text-white py-1 text-sm rounded hover:bg-user-secondary transition"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>

      <button className="absolute top-2 right-2 text-user-primary hover:text-red-500">
        <FaHeart />
      </button>
    </div>
  );
}
