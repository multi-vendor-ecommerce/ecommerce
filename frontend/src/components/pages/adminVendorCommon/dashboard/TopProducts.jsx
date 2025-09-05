import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import ProductContext from "../../../../context/products/ProductContext";
import TabularData from "../../../common/layout/TabularData";
import ShowLessMore from "../../../common/helperComponents/ShowLessMore";
import Loader from "../../../common/Loader";
import { RenderProductRow } from "../../adminVendorCommon/product/RenderProductRow";

const TopProducts = () => {
  const { loading, getTopSellingProducts } = useContext(ProductContext);
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    const fetchTopSelling = async () => {
      const result = await getTopSellingProducts({ limit: 100 });
      if (result?.products) {
        setProducts(result.products);
        setCategoryStats(result.categoryStats || []);
      }
    };
    fetchTopSelling();
  }, []);

  const maxUnitsSold = products.length > 0
    ? Math.max(...products.map(p => p.unitsSold || 0))
    : 0;

  const productsToShow = showAll ? products : products.slice(0, 5);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md transition duration-300">
      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <div>
          {/* Title + View All */}
          <div className="min-h-16 w-full flex gap-2 justify-between items-center mb-5">
            <h2 className="w-2/3 md:w-auto text-xl md:text-2xl font-bold text-gray-800 truncate">Top Selling Products</h2>
            <NavLink
              to="/admin/top-selling-products"
              className="w-1/3 md:w-auto border-gray-300 px-2 md:px-4 py-2 rounded-xl text-center text-sm md:text-[16px] font-medium text-black hover:text-blue-500 border-2 hover:border-blue-500 transition cursor-pointer"
            >
              View All
            </NavLink>
          </div>

          {/* Table of Products */}
          <TabularData
            headers={[
              "Product", "ID", "Brand", "Category", "Price", "Units Sold",
              "Revenue", "Status", "Sales Progress", "Actions"
            ]}
            data={productsToShow}
            renderRow={(p, i) => RenderProductRow(p, i, maxUnitsSold, true)}
            emptyMessage="No products available."
          />

          {/* Show More / Less */}
          <ShowLessMore
            showAll={showAll}
            toggleShowAll={() => setShowAll(prev => !prev)}
            condition={products.length > 5}
          />

          {/* Top Categories Section */}
          {categoryStats.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Top Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categoryStats
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .slice(0, 3)
                  .map((c) => (
                    <div
                      key={c.category._id}
                      className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200"
                    >
                      <p className="font-bold text-gray-700">{c.category.name}</p>
                      <p className="text-sm text-gray-600">Revenue: ₹{c.totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Units Sold: {c.totalUnitsSold}</p>
                      <p className="text-sm text-gray-600">Products: {c.productCount}</p>
                      <p className="text-sm text-gray-600">Avg. Rating: {c.averageRating.toFixed(1)}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TopProducts;
