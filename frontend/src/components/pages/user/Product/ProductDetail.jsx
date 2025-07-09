import React from "react";
import { useParams } from "react-router-dom";
import { productListData } from "../Utils/productListData";

export default function ProductDetails() {
  const { id } = useParams();
  const product = productListData.find((item) => item.id === parseInt(id));

  if (!product) return <div className="p-4 text-red-500">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-72 object-contain mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-lg text-user-primary font-semibold mb-4">₹{product.price}</p>
      <p className="text-gray-600">This is a detailed description of the product. You can customize this section to add more info.</p>
    </div>
  );
}
