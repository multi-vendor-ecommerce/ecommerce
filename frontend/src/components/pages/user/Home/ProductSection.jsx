import React from "react";
import { products } from "../Utils/productData";

export default function ProductSection({ title }) {
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[180px] max-w-[200px] bg-white rounded shadow p-2 hover:scale-105 transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-contain"
            />
            <h4 className="mt-2 font-medium text-sm line-clamp-1">
              {product.name}
            </h4>
            <p className="text-blue-600 font-semibold">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
