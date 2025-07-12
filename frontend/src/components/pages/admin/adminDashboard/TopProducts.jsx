import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import ProductContext from "../../../../context/products/ProductContext";
import TabularData from "../../../common/layout/TabularData";
import { RenderProductRow } from "../adminProducts/RenderProductRow";
import ShowLessMore from "../helperComponents/ShowLessMore";
import Spinner from "../../../common/Spinner";

const TopProducts = () => {
  const context = useContext(ProductContext);
  const { products, getAllProducts, loading } = context;

  useEffect(() => {
    getAllProducts();
  }, []);

  const maxUnitsSold = Math.max(...products.map((p) => p.unitsSold));
  const topProducts = [...products].filter(p => p.approved).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 100);

  const [showAll, setShowAll] = useState(false);
  const productsToShow = showAll ? topProducts : topProducts.slice(0, 5);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      {loading ?
        <div className="flex justify-center">
          <Spinner />
        </div>
        :
        <div>
          <div className="min-h-16 flex justify-between items-center mb-5">
            <h2 className="textxl md:text-2xl font-bold text-gray-800">Top Selling Products</h2>
            <NavLink
              to="/admin/top-selling-products"
              className="border-gray-300 px-2 md:px-4 py-2 rounded-xl text-sm md:text-[16px] font-medium text-black hover:text-blue-500 border-2 hover:border-blue-500 transition cursor-pointer"
            >
              View All
            </NavLink>
          </div>

          <div>
            <TabularData
              headers={["Product", "ID", "Category", "Price", "Units Sold", "Revenue", "Sales Progress", "Actions"]}
              data={productsToShow}
              renderRow={(p, i) => RenderProductRow(p, i, maxUnitsSold)}
              emptyMessage="No products available."
              widthClass="w-full"
            />
          </div>

          <ShowLessMore showAll={showAll} toggleShowAll={() => setShowAll((prev) => !prev)} condition={topProducts.length > 5} />
        </div>}
    </section>
  );
};

export default TopProducts;
