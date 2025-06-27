import { useState } from "react";
import { Link } from "react-router-dom";
import { topProducts } from "./data/topProductsData";

const TopProducts = () => {
  const [showAll, setShowAll] = useState(false);
  const productsToShow = showAll ? topProducts : topProducts.slice(0, 5);

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

      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-left text-gray-600">
          <thead className="text-sm uppercase text-gray-500 bg-gray-50">
            <tr>
              {["Product ID", "Name", "Category", "Units Sold", "Revenue"].map((header) => (
                <th key={header} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productsToShow.map((product, idx) => (
              <tr
                key={product.id}
                className={`hover:bg-blue-50 hover:shadow-sm transition duration-150 ${idx !== 0 ? "border-t border-gray-200" : ""
                  }`}
              >
                <td className="px-4 py-3 hover:scale-105 transition duration-150 font-medium text-blue-600 hover:underline">
                  <Link to={`/admin/orders/${product.id}`}>{product.id}</Link>
                </td>
                <td className="px-4 py-3 hover:scale-105 transition duration-150 font-medium">{product.name}</td>
                <td className="px-4 py-3 hover:scale-105 transition duration-150">{product.category}</td>
                <td className="px-4 py-3 hover:scale-105 transition duration-150">{product.sales}</td>
                <td className="px-4 py-3 hover:scale-105 transition duration-150 font-semibold text-gray-800">
                  {product.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        {topProducts.length > 5 && (
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
