import { useEffect, useContext, useState } from "react";
import VendorContext from "../../../../context/vendors/VendorContext";
import { RenderVendorRow } from "./RenderVendorRow";
import TabularData from "../../../common/layout/TabularData";
import Spinner from "../../../common/Spinner";
import { vendorFilterFields } from "./data/vendorFilterFields";
import FilterBar from "../../../common/FilterBar";
import BackButton from "../../../common/layout/BackButton";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";

const VendorManagement = ({ heading }) => {
  const { vendors, getAllVendors, totalCount, loading } = useContext(VendorContext);

  const [filters, setFilters] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchPaginatedVendors(1, limit); // initial fetch
  }, []);

  const fetchPaginatedVendors = (pg = 1, lim = limit) => {
    getAllVendors({ ...filters, page: pg, limit: lim });
    setPage(pg);
  };

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    fetchPaginatedVendors(1, limit);
  };

  const handleClear = () => {
    const reset = { search: "", status: "" };
    setFilters(reset);
    fetchPaginatedVendors(1, limit);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleApply();
  };

  const handlePageChange = (pg) => {
    fetchPaginatedVendors(pg, limit);
  };

  const handleItemsPerPageChange = (lim) => {
    setLimit(lim);
    fetchPaginatedVendors(1, lim);
  };

  const headers = ["Vendor", "Email", "Shop", "Products Qty", "Total Sales", "Commission", "Registered On", "Status", "Actions"];

  if (loading && vendors.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
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
          onKeyDown={handleKeyDown}
        />
      </div>

      <PaginatedLayout
        totalItems={totalCount}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      >
        {() => (
          <div className="overflow-hidden bg-white shadow-md shadow-blue-500 rounded-xl border border-gray-200">
            <TabularData
              headers={headers}
              data={vendors}
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
