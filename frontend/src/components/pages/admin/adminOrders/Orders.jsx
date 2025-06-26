import { useState } from "react";
import { Link } from "react-router-dom";
import { ordersDummy, orderFilterOptions } from "./data/ordersData"
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

/* Status Chip Helper */
const StatusChip = ({ status }) => {
  const map = {
    delivered: {
      text: "Delivered",
      icon: <FaCheckCircle size={12} className="text-green-600" />,
      cls: "text-green-700 bg-green-100",
    },
    pending: {
      text: "Pending",
      icon: <FaClock size={12} className="text-yellow-600" />,
      cls: "text-yellow-800 bg-yellow-100",
    },
    cancelled: {
      text: "Cancelled",
      icon: <FaTimesCircle size={12} className="text-red-600" />,
      cls: "text-red-700 bg-red-100",
    },
  };

  const cfg = map[status.toLowerCase()] || {
    text: status,
    icon: null,
    cls: "text-gray-700 bg-gray-100",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {cfg.icon}
      {cfg.text}
    </span>
  );
};

/* Main Orders Component */
export default function Orders() {
  const [filters, setFilters] = useState({ status: "", date: "" });

  const filtered = ordersDummy.filter((o) => {
    const statusOK = filters.status ? o.status === filters.status : true;
    const dateOK = filters.date ? o.date === filters.date : true;
    return statusOK && dateOK;
  });

  return (
    <div className="bg-gray-100 min-h-screen p-6 rounded-2xl shadow-md">
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
      <div className="bg-white shadow-md shadow-blue-500 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-gray-600">
          <thead className="bg-gray-50 uppercase text-sm text-gray-500">
            <tr>
              {["Order No", "Date", "Product", "Status", "Action"].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((o, i) => (
                <tr
                  key={o.orderNo}
                  className={`hover:bg-blue-50 hover:shadow-sm transition ${
                    i !== 0 ? "border-t border-gray-200" : ""
                  }`}
                >
                  <td className="px-4 py-3">{o.orderNo}</td>
                  <td className="px-4 py-3">{o.date}</td>
                  <td className="px-4 py-3">{o.product}</td>
                  <td className="px-4 py-3">
                    <StatusChip status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/all-orders/order-details/${o.orderNo}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
