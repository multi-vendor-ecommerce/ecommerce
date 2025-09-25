import { useState, useContext, useEffect } from "react";
import StatusChip from "../../../common/helperComponents/StatusChip";
import { orderFilterFields } from "./data/orderFilterFields";
import { RenderOrderRow } from "./RenderOrderRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import OrderContext from "../../../../context/orders/OrderContext";
import Loader from "../../../common/Loader";
import FilterBar from "../../../common/FilterBar";
import BackButton from "../../../common/layout/BackButton";

export default function Orders({ role = "admin", vendorId = null }) {
  const { orders, getAllOrders, loading, totalCount } = useContext(OrderContext);

  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getAllOrders({ ...filters, vendorId, page, limit: itemsPerPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, page, itemsPerPage, filters]);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setPage(1);
    getAllOrders({ ...filters, vendorId, page: 1, limit: itemsPerPage });
  };

  const handleClear = () => {
    const cleared = { search: "", status: "", date: "" };
    setFilters(cleared);
    setPage(1);
    getAllOrders({ ...cleared, vendorId, page: 1, limit: itemsPerPage });
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
    ...(role === "admin" && !vendorId ? ["Vendor"] : []),
    "Total",
    "Mode",
    "Date",
    "Status",
    "Amount",
    "Actions"
  ];

  if (loading && orders.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <section className={`min-h-screen ${!vendorId && "bg-gray-100 p-6 shadow-md"}`}>
      {!vendorId && <BackButton />}

      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mt-4 mb-6">
        {!vendorId && (
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            All Orders
          </h2>
        )}

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
              renderRow={(o, i) => RenderOrderRow(o, i, StatusChip, role, vendorId)}
              emptyMessage="No orders found."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}
