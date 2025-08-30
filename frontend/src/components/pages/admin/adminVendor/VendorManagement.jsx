import { useEffect, useContext, useState, useCallback } from "react";
import VendorContext from "../../../../context/vendors/VendorContext";
import { RenderVendorRow } from "./RenderVendorRow";
import TabularData from "../../../common/layout/TabularData";
import Loader from "../../../common/Loader";
import { vendorFilterFields } from "./data/vendorFilterFields";
import FilterBar from "../../../common/FilterBar";
import BackButton from "../../../common/layout/BackButton";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";

const VendorManagement = ({ heading }) => {
  const { vendors, topVendors, getAllVendors, getTopVendors, totalCount, loading } = useContext(VendorContext);

  const [filters, setFilters] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isTopVendorPage = heading?.toLowerCase().includes("top");

  // Choose correct fetch function based on heading
  const fetchFunction = useCallback(
    (params) => {
      if (isTopVendorPage) {
        return getTopVendors(params);
      } else {
        return getAllVendors(params);
      }
    },
    [isTopVendorPage, getAllVendors, getTopVendors]
  );

  const fetchPaginatedVendors = (pg = 1, limit = itemsPerPage) => {
    fetchFunction({ ...filters, page: pg, limit });
    setPage(pg);
  };

  // Initial fetch and refetch on heading change
  useEffect(() => {
    fetchPaginatedVendors(1, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heading]);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    fetchPaginatedVendors(1, itemsPerPage);
  };

  const handleClear = () => {
    const reset = { search: "", status: "" };
    setFilters(reset);
    fetchPaginatedVendors(1, itemsPerPage);
  };

  const handlePageChange = (pg) => {
    fetchPaginatedVendors(pg, itemsPerPage);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    fetchPaginatedVendors(1, limit);
  };

  const headers = [
    "Vendor",
    "Email",
    "Shop",
    "Products Qty",
    "Total Sales",
    "Commission",
    "Registered On",
    "Status",
    "Actions"
  ];

  if (loading && vendors.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <section className="bg-gray-100 w-full min-h-screen p-6 shadow-md">
      <BackButton />

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{heading}</h2>

        <FilterBar
          fields={vendorFilterFields}
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
          <div className="overflow-hidden bg-white shadow-md shadow-blue-500 rounded-xl border border-gray-200">
            <TabularData
              headers={headers}
              data={isTopVendorPage ? topVendors : vendors}
              renderRow={RenderVendorRow}
              emptyMessage="No vendors found."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
};

export default VendorManagement;