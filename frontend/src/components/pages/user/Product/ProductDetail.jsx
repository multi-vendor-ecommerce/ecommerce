import React from "react";
import { useParams } from "react-router-dom";
import { productListData } from "../Utils/productListData";

export default function ProductDetail() {
  const { id } = useParams();
  const product = productListData.find((item) => item.id === parseInt(id));

  if (!product) {
    return (
      <div className="mt-16 p-6 text-center text-xl text-red-500">
        Product not found 😢
      </div>
    );
  }

  return (
    <div className="mt-16 bg-user-base min-h-screen text-user-dark p-6">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-contain bg-white p-4 rounded"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-xl text-user-primary font-semibold">₹{product.price}</p>

          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed
            purus at justo vulputate iaculis. (Dummy description)
          </p>

          <div className="flex gap-4">
            <button className="bg-user-primary text-white px-6 py-2 rounded hover:bg-user-secondary">
              Add to Cart
            </button>
            <button className="border border-user-primary text-user-primary px-6 py-2 rounded hover:bg-user-secondary hover:text-white transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
