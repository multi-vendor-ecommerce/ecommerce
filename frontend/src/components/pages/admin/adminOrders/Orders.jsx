// components/admin/orders/Orders.jsx
import { useState } from "react";
import { ordersDummy, orderFilterOptions } from "./data/ordersData";
import StatusChip from "../helperComponents/StatusChip";
import { RenderOrderRow } from "./RenderOrderRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";

/* Main Orders Component */
export default function Orders() {
  const [filters, setFilters] = useState({ status: "", date: "" });

  // ── filter logic ───────────────────────────────────────────
  const filtered = ordersDummy.filter((o) => {
    const statusOK = filters.status ? o.status === filters.status : true;
    const dateOK = filters.date ? o.date === filters.date : true;
    return statusOK && dateOK;
  });

  // ── table header labels ───────────────────────────────────
  const headers = ["Order ID", "Customer", "Date", "Total", "Status", "Actions"];

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">All Orders</h2>

        <div className="flex gap-3 flex-wrap">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Table + Pagination handled by PaginatedLayout */}
      <PaginatedLayout data={filtered} initialPerPage={10}>
        {(currentItems) => (
          <div className="overflow-hidden bg-white shadow-md shadow-blue-500 rounded-xl border border-gray-200">
            <TabularData
              headers={headers}
              data={currentItems}
              renderRow={(o, i) => RenderOrderRow(o, i, StatusChip)}
              emptyMessage="No orders found."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}
