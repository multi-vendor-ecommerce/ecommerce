import { useState, useContext, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import FilterBar from "../../../common/FilterBar";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import UserContext from "../../../../context/user/UserContext";
import Loader from "../../../common/Loader";
import BackButton from "../../../common/layout/BackButton";
import { customerFilterFields } from "./data/customerFilterFields";
import { RenderCustomerRow } from "./RenderCustomerRow";

const Customers = ({}) => {
  const { users, getAllCustomers, totalCount, loading } = useContext(UserContext);

  const [filters, setFilters] = useState({ search: "", date: "" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCustomers = useCallback(() => {
    getAllCustomers({ ...filters, page, limit: itemsPerPage });
  }, [filters, page, itemsPerPage]);

  useEffect(() => {
    fetchCustomers();
  }, [page, itemsPerPage]);

  // 🔹 Debounced fetch for search field only
  useEffect(() => {
    if (filters.search.trim() !== "") {
      const debounced = debounce(() => {
        getAllCustomers({ ...filters, page: 1, limit: itemsPerPage });
      }, 500);
      debounced();
      return () => debounced.cancel();
    } else {
      // When search cleared, reload immediately
      getAllCustomers({ ...filters, page: 1, limit: itemsPerPage });
    }
  }, [filters.search, itemsPerPage]);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setPage(1);
    fetchCustomers();
  };

  const handleClear = () => {
    const cleared = { search: "", date: "" };
    setFilters(cleared);
    setPage(1);
    getAllCustomers({ ...cleared, page: 1, limit: itemsPerPage });
  };

  const handlePageChange = (pg) => setPage(pg);
  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setPage(1);
  };

  const headers = ["Customer", "Email", "Phone", "Location", "Total Orders", "Total Value", "Registered On"];

  if (loading && users.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <BackButton />

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Customers</h2>

        <FilterBar
          fields={customerFilterFields}
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
              data={users}
              renderRow={RenderCustomerRow}
              emptyMessage="No customers found."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}

export default Customers;