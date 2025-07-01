import { useState } from "react";
import { Link } from "react-router-dom";
import ProductsDetails from "../adminProducts/ProductsDetails";
import { productsData } from "../adminProducts/data/productsData";

const TopProducts = () => {
  const [showAll, setShowAll] = useState(false);
  const productsToShow = showAll ? productsData : productsData.slice(0, 5);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md transition duration-300">
      <div className="min-h-16 flex justify-between items-center mb-5">
        <h2 className="textxl md:text-2xl font-bold text-gray-800">Top Selling Products</h2>
        <Link
          to="/admin/top-products"
          className="border-gray-300 px-2 md:px-4 py-2 rounded-xl text-sm md:text-[16px] font-medium text-black hover:text-blue-500 border-2 hover:border-blue-500 transition cursor-pointer"
        >
          View all
        </Link>
      </div>

      <div className="rounded-xl overflow-x-auto">
        <ProductsDetails currentItems={productsToShow} />
      </div>

      <div>
        {productsData.length > 5 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopProducts;
