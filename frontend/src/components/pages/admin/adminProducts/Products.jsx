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
  const { getAllProducts, getTopSellingProducts, loading } = useContext(ProductContext);

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isTopSellingPage = heading?.toLowerCase().includes("top");

  useEffect(() => {
    if (isTopSellingPage) {
      fetchTopSelling();
    } else {
      fetchPaginatedProducts(1, itemsPerPage);
    }
  }, []);

  const fetchPaginatedProducts = async (pg = 1, limit = itemsPerPage) => {
    const result = await getAllProducts({ ...filters, page: pg, limit });
    if (result?.products) {
      setProducts(result.products);
      setTotalCount(result.total);
      setPage(pg);
    }
  };

  const fetchTopSelling = async () => {
    const topProducts = await getTopSellingProducts(100);
    setProducts(topProducts);
    setTotalCount(topProducts.length);
  };

  const handleChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    if (isTopSellingPage) {
      fetchTopSelling();
    } else {
      fetchPaginatedProducts(1, itemsPerPage);
    }
  };

  const handleClear = () => {
    const reset = { search: "", status: "" };
    setFilters(reset);
    if (isTopSellingPage) {
      fetchTopSelling();
    } else {
      fetchPaginatedProducts(1, itemsPerPage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleApply();
  };

  const handlePageChange = (pg) => {
    if (!isTopSellingPage) fetchPaginatedProducts(pg, itemsPerPage);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    if (!isTopSellingPage) fetchPaginatedProducts(1, limit);
  };

  const headers = [
    "Product", "ID", "Category", "Price", "Units Sold",
    "Revenue", "Approval Status", "Sales Progress", "Actions"
  ];

  const maxUnitsSold = Math.max(...(products?.map(p => p.unitsSold || 0) || [0]));

  if (loading && products.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

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

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{heading}</h2>
        <FilterBar
          fields={productFilterFields}
          values={filters}
          onChange={handleChange}
          onApply={handleApply}
          onClear={handleClear}
          onKeyDown={handleKeyDown}
        />
      </div>

      <PaginatedLayout
        totalItems={totalCount}
        currentPage={page}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        disablePagination={isTopSellingPage} // <--- disables pagination UI if top-selling
      >
        {() => (
          <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden">
            <TabularData
              headers={headers}
              data={products}
              renderRow={(p, i) => RenderProductRow(p, i, maxUnitsSold)}
              emptyMessage="No products available."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}
