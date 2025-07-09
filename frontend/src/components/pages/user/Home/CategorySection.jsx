import React from "react";
import { categories } from "../Utils/categoryData";

export default function CategorySection() {
  return (
    <div className="py-6 px-4 grid grid-cols-3 sm:grid-cols-5 gap-4 bg-white shadow">
      {categories.map((cat, i) => {
        const Icon = cat.icon;
        return (
          <div
            key={i}
            className="flex flex-col items-center hover:text-blue-600 cursor-pointer transition-transform hover:scale-105"
          >
            <Icon className="text-3xl mb-1" />
            <span className="text-sm font-medium">{cat.name}</span>
          </div>
        );
      })}
    </div>
  );
}
