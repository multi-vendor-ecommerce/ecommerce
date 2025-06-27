import { useState } from "react";
import { ordersDummy, orderFilterOptions } from "./data/ordersData";
import StatusChip from "../helperComponents/StatusChip";
import OrdersData from "./OrdersData";

/* Main Orders Component */
export default function Orders() {
  const [filters, setFilters] = useState({ status: "", date: "" });

  const filtered = ordersDummy.filter((o) => {
    const statusOK = filters.status ? o.status === filters.status : true;
    const dateOK = filters.date ? o.date === filters.date : true;
    return statusOK && dateOK;
  });

  return (
    <section className="bg-gray-100 min-h-screen p-6 rounded-2xl shadow-md">
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

      {/* Table */}
      <div className="shadow-md shadow-blue-500 rounded-xl border border-gray-200">
        <OrdersData orders={filtered} StatusChip={StatusChip} />
      </div>
    </section>
  );
}
