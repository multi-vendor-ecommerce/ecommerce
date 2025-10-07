import { useContext, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import ProductContext from "../../../../context/products/ProductContext";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import { RenderProductRow } from "./RenderProductRow";
import Loader from "../../../common/Loader";
import FilterBar from "../../../common/FilterBar";
import { productFilterFields } from "./data/productFilterFields";
import BackButton from "../../../common/layout/BackButton";
import { NavLink } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

export default function Products({ heading, role = "admin" }) {
  const { getAllProducts, getTopSellingProducts, loading } = useContext(ProductContext);

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isTopSellingPage = heading?.toLowerCase().includes("top");

  useEffect(() => {
    if (isTopSellingPage) {
      fetchTopSelling(page, itemsPerPage);
    } else {
      fetchPaginatedProducts(page, itemsPerPage);
    }
  }, [page, itemsPerPage, isTopSellingPage]);

  const fetchPaginatedProducts = async (pg = 1, limit = itemsPerPage, customFilters = filters) => {
    const result = await getAllProducts({ ...customFilters, page: pg, limit });
    if (result?.products) {
      setProducts(result.products);
      setTotalCount(result.total);
    }
  };

  const fetchTopSelling = async (pg = 1, limit = itemsPerPage, customFilters = filters) => {
    const result = await getTopSellingProducts({ ...customFilters, page: pg, limit });
    if (result?.products) {
      setProducts(result.products);
      setTotalCount(result.total);
    }
  };

  // 🔹 Debounced fetch for search field only
  useEffect(() => {
    if (filters.search.trim() !== "") {
      const debounced = debounce(() => {
        if (isTopSellingPage) {
          fetchTopSelling(1, itemsPerPage, filters);
        } else {
          fetchPaginatedProducts(1, itemsPerPage, filters);
        }
      }, 500);
      debounced();
      return () => debounced.cancel();
    } else {
      // When search is cleared, reload immediately
      if (isTopSellingPage) {
        fetchTopSelling(1, itemsPerPage, filters);
      } else {
        fetchPaginatedProducts(1, itemsPerPage, filters);
      }
    }
  }, [filters.search, itemsPerPage, isTopSellingPage]);

  const handleChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setPage(1);
    if (isTopSellingPage) {
      fetchTopSelling(1, itemsPerPage);
    } else {
      fetchPaginatedProducts(1, itemsPerPage);
    }
  };

  const handleClear = () => {
    const reset = { search: "", status: "" };
    setFilters(reset);
    setPage(1);

    if (isTopSellingPage) {
      fetchTopSelling(1, itemsPerPage, reset);
    } else {
      fetchPaginatedProducts(1, itemsPerPage, reset);
    }
  };

  const handlePageChange = (pg) => {
    setPage(pg);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setPage(1); // Reset to first page on limit change
  };

  const headers = [
    "Product", "ID", "Brand", "Category", "Actual Price", "Discount Price", "Stock", "Units Sold",
    "Revenue", "Status", "Sales Progress", "Actions"
  ];

  const maxUnitsSold = Math.max(...(products?.map(p => p.unitsSold || 0) || [0]));

  if (loading && products.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  // Filter out status field for top selling page
  const filterFields = isTopSellingPage
    ? productFilterFields.filter(f => f.name !== "status")
    : productFilterFields;

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <BackButton />
        {role === "vendor" && (
          <NavLink
            to={`/vendor/add-product`}
            className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-blue-600 font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
          >
            <FiPlus className="text-lg md:text-2xl" />
            <span className="hidden md:inline-block">Add Product</span>
          </NavLink>
        )}
      </div>

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{heading}</h2>
        <FilterBar
          fields={filterFields}
          values={filters}
          onChange={handleChange}
          onApply={handleApply}
          onClear={handleClear}
        />
      </div>

      <PaginatedLayout
        totalItems={totalCount}
        currentPage={page}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      >
        {() => (
          <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden">
            <TabularData
              headers={headers}
              data={products}
              renderRow={(p, i) => RenderProductRow(p, i, maxUnitsSold, isTopSellingPage, role)}
              emptyMessage="No products available."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}