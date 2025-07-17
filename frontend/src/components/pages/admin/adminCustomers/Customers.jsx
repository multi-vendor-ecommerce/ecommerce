// components/admin/customers/Customers.jsx
import { useContext, useEffect, useState } from "react";
import UserContext from "../../../../context/user/UserContext";
import { RenderCustomerRow } from "./RenderCustomerRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import Spinner from "../../../common/Spinner";
import FilterBar from "../../../common/FilterBar";

const Customers = () => {
  const { users, getAllCustomers, loading } = useContext(UserContext);
  const [filters, setFilters] = useState({ search: "", date: "" });

  useEffect(() => {
    getAllCustomers();
  }, []);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    getAllCustomers(filters);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  const handleClear = () => {
    const reset = { search: "", date: "" };
    setFilters(reset);
    getAllCustomers(reset);
  };

  const customerFilterFields = [
    { name: "search", label: "Search by name, email, or location", type: "text" },
    { name: "date", label: "Date", type: "date" }
  ];

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  const headers = ["Customer", "Email", "Location", "Total Orders", "Total Value", "Registered On"];

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Customers</h2>

      <div>
        <FilterBar
          fields={customerFilterFields}
          values={filters}
          onChange={handleChange}
          onApply={handleApply}
          onClear={handleClear}
          onKeyDown={handleKeyDown}
        />
      </div>

      <PaginatedLayout data={users} initialPerPage={10}>
        {(currentItems) => (
          <div className="overflow-hidden bg-white shadow-md shadow-blue-500 rounded-xl border border-gray-200">
            <TabularData
              headers={headers}
              data={currentItems}
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
