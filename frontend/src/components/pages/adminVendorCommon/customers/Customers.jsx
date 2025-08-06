import { useContext, useEffect, useState } from "react";
import UserContext from "../../../../context/user/UserContext";
import { RenderCustomerRow } from "./RenderCustomerRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import Spinner from "../../../common/Spinner";
import FilterBar from "../../../common/FilterBar";
import BackButton from "../../../common/layout/BackButton";

const Customers = ({}) => {
  const { users, getAllCustomers, totalCount, loading } = useContext(UserContext);

  const [filters, setFilters] = useState({ search: "", date: "" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPaginatedCustomers(1, itemsPerPage); // initial fetch
  }, []);

  const fetchPaginatedCustomers = async (pg = 1, limit = itemsPerPage) => {
    await getAllCustomers({ ...filters, page: pg, limit });
    setPage(pg);
  };

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    fetchPaginatedCustomers(1, itemsPerPage);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleApply();
  };

  const handleClear = () => {
    const reset = { search: "", date: "" };
    setFilters(reset);
    fetchPaginatedCustomers(1, itemsPerPage);
  };

  const handlePageChange = (pg) => {
    fetchPaginatedCustomers(pg, itemsPerPage);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    fetchPaginatedCustomers(1, limit);
  };

  const customerFilterFields = [
    { name: "search", label: "Search by name, email, or location", type: "text" },
    { name: "date", label: "Date", type: "date" },
  ];

  const headers = ["Customer", "Email", "Phone", "Location", "Total Orders", "Total Value", "Registered On"];

  if (loading && users.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
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
          onKeyDown={handleKeyDown}
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
};

export default Customers;