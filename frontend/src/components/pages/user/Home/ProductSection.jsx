import React from "react";
import ProductCard from '../Product/ProductCard';
import { productListData } from "../Utils/productListData";

export default function ProductSection({ title }) {
  return (
    <div className="py-6 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4 text-user-dark">{title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productListData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
