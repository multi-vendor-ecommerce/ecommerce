import { useState, useContext, useEffect } from "react";
import StatusChip from "../../../common/helperComponents/StatusChip";
import { orderFilterFields } from "./data/ordersData";
import { RenderOrderRow } from "./RenderOrderRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import BackButton from "../../../common/layout/BackButton";
import OrderContext from "../../../../context/orders/OrderContext";
import Loader from "../../../common/Loader";
import FilterBar from "../../../common/FilterBar";

export default function Orders({ role = "admin" }) {
  const { orders, getAllOrders, loading, totalCount } = useContext(OrderContext);

  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getAllOrders({ ...filters, page, limit: itemsPerPage });
  }, [page, itemsPerPage]);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setPage(1);
    getAllOrders({ ...filters, page: 1, limit: itemsPerPage });
  };

  const handleClear = () => {
    const cleared = { search: "", status: "" };
    setFilters(cleared);
    setPage(1);
    getAllOrders({ ...cleared, page: 1, limit: itemsPerPage });
  };

  const handlePageChange = (pg) => {
    setPage(pg);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setPage(1);
  };

  const headers = [
    "Order ID",
    "Customer",
    ...(role === "admin" ? ["Vendor"] : []),
    "Total",
    "Mode",
    "Date",
    "Status",
    "Amount",
    "Actions"
  ];

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <BackButton />

      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mt-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">All Orders</h2>

        <div>
          <FilterBar
            fields={orderFilterFields}
            values={filters}
            onChange={handleChange}
            onApply={handleApply}
            onClear={handleClear}
          />
        </div>
      </div>

      {/* Table + Pagination */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader />
        </div>
      ) : (
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
                data={orders}
                renderRow={(o, i) => RenderOrderRow(o, i, StatusChip, role)}
                emptyMessage="No orders found."
              />
            </div>
          )}
        </PaginatedLayout>
      )}
    </section>
  );
}
