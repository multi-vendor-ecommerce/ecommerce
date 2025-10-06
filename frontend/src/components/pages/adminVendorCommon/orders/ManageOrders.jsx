import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

// Demo sample orders (replace with API data)
const sampleOrders = [
  {
    _id: "ORD001",
    shippingInfo: { recipientName: "Rohan Sharma" },
    orderStatus: "pending",
    grandTotal: 1299,
    createdAt: "2025-10-04T10:12:00",
  },
  {
    _id: "ORD002",
    shippingInfo: { recipientName: "Meera Patel" },
    orderStatus: "readyToShip",
    grandTotal: 2499,
    createdAt: "2025-10-05T11:45:00",
  },
  {
    _id: "ORD003",
    shippingInfo: { recipientName: "Aman Verma" },
    orderStatus: "delivered",
    grandTotal: 999,
    createdAt: "2025-10-03T09:00:00",
  },
];

const ManageOrders = () => {
  // Active tab filter
  const [statusFilter, setStatusFilter] = useState("all");

  // Columns definition
  const columns = useMemo(
    () => [
      {
        header: "Order ID",
        accessorKey: "_id",
        cell: (info) => (
          <span className="font-medium text-blue-600">{info.getValue()}</span>
        ),
      },
      {
        header: "Customer",
        accessorKey: "shippingInfo.recipientName",
      },
      {
        header: "Status",
        accessorKey: "orderStatus",
        cell: (info) => {
          const status = info.getValue();
          const colorMap = {
            pending: "bg-yellow-100 text-yellow-700",
            readyToShip: "bg-blue-100 text-blue-700",
            shipped: "bg-purple-100 text-purple-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
          };
          return (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${colorMap[status] || ""}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        header: "Total (₹)",
        accessorKey: "grandTotal",
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        cell: (info) =>
          new Date(info.getValue()).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },
      {
        header: "Actions",
        cell: (info) => (
          <button className="text-sm text-indigo-600 hover:underline">
            View
          </button>
        ),
      },
    ],
    []
  );

  // Filter data by tab
  const filteredData =
    statusFilter === "all"
      ? sampleOrders
      : sampleOrders.filter((order) => order.orderStatus === statusFilter);

  // Initialize table
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Ready to Ship", value: "readyToShip" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${statusFilter === tab.value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;