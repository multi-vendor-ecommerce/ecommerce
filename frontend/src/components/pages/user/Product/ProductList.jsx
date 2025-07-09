import React from "react";
import { productListData } from "../Utils/productListData";
import { filters } from "../Utils/filters";
import ProductCard from "./ProductCard";


export default function ProductList() {
  return (
    <div className="mt-16 bg-user-base text-user-dark min-h-screen p-4">
      <div className="container mx-auto flex gap-6">
        {/* Sidebar Filters */}
        <aside className="w-[250px] bg-white p-4 rounded shadow hidden md:block">
          <h3 className="text-lg font-semibold mb-3">Filters</h3>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Category</h4>
            {filters.categories.map((cat, idx) => (
              <div key={idx} className="mb-1 text-sm">
                <input type="checkbox" className="mr-2" />
                <label>{cat}</label>
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-medium mb-2">Price</h4>
            {filters.priceRange.map((range, idx) => (
              <div key={idx} className="mb-1 text-sm">
                <input type="radio" name="price" className="mr-2" />
                <label>{range}</label>
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <h2 className="text-xl font-bold mb-4">All Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {productListData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
