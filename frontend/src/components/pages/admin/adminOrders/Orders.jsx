import { useState } from "react";
import { ordersDummy, orderFilterOptions } from "./data/ordersData";
import StatusChip from "../helperComponents/StatusChip";
import OrdersData from "./OrdersData";
import Pagination from "../../../common/Pagination";
import ItemsPerPageSelector from "../../../common/ItemsPerPageSelector";

/* Main Orders Component */
export default function Orders() {
  const [filters, setFilters] = useState({ status: "", date: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filtered = ordersDummy.filter((o) => {
    const statusOK = filters.status ? o.status === filters.status : true;
    const dateOK = filters.date ? o.date === filters.date : true;
    return statusOK && dateOK;
  });

  const start = currentPage * itemsPerPage;
  const currentItems = filtered.slice(start, start + itemsPerPage);

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">All Orders</h2>

        <div className="flex gap-3 flex-wrap">
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setCurrentPage(0);
            }}
            className="border border-gray-300 px-3 py-2 rounded-md text-sm"
          >
            {orderFilterOptions.status.map((opt) => (
              <option key={opt} value={opt}>
                {opt || "All Statuses"}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => {
              setFilters({ ...filters, date: e.target.value });
              setCurrentPage(0);
            }}
            className="border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="shadow-md shadow-blue-500 rounded-xl border border-gray-200">
        <OrdersData orders={currentItems} StatusChip={StatusChip} />
      </div>

      {/* Pagination + Items/Page */}
      <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
        <Pagination
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={(val) => {
            setItemsPerPage(val);
            setCurrentPage(0);
          }}
        />
      </div>
    </section>
  );
}
