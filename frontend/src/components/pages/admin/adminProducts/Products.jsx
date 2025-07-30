// Products.jsx
import { useContext, useEffect, useState } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import { RenderProductRow } from "./RenderProductRow";
import Spinner from "../../../common/Spinner";
import FilterBar from "../../../common/FilterBar";
import { productFilterFields } from "./data/productFilterFields";
import BackButton from "../../../common/layout/BackButton";
import { NavLink } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

export default function Products({ heading }) {
  const context = useContext(ProductContext);
  const { products, getAllProducts, loading } = context;
  const [filters, setFilters] = useState({ search: "", status: "" });

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    getAllProducts(filters);
  };

  const handleClear = () => {
    setFilters({ search: "", status: "" });
    getAllProducts();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  const approvedProducts = products?.filter(p => p.status) || [];

  const topProducts = approvedProducts
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 100);
  const maxUnitsSold = topProducts.length > 0
    ? Math.max(...topProducts.map(p => p.unitsSold || 0))
    : 0;

  const headers = ["Product", "ID", "Category", "Price", "Units Sold", "Revenue", "Approval Status", "Sales Progress", "Actions"];

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <BackButton />

        <NavLink
          to={`/admin/theme/add-product`}
          className="flex items-center gap-2 px-3 md:px-6 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
        >
          <FiEdit className="text-lg md:text-2xl" />
          <span className="hidden md:inline-block">Add Product</span>
        </NavLink>
      </div>

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 lg:gap-0 mt-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{heading}</h2>

        <div>
          <FilterBar
            fields={productFilterFields}
            values={filters}
            onChange={handleChange}
            onApply={handleApply}
            onClear={handleClear}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <PaginatedLayout data={heading === "Top Selling Products" ? topProducts : products} initialPerPage={10}>
        {(currentItems) => (
          <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden">
            <TabularData
              headers={headers}
              data={currentItems}
              renderRow={(p, i) => RenderProductRow(p, i, maxUnitsSold)}
              emptyMessage="No products available."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}
