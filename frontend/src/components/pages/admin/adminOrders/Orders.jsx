// components/admin/orders/Orders.jsx
import { useState, useContext, useEffect } from "react";
import StatusChip from "../../../common/helperComponents/StatusChip";
import { orderFilterFields } from "./data/ordersData";
import { RenderOrderRow } from "./RenderOrderRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import BackButton from "../../../common/layout/BackButton";
import OrderContext from "../../../../context/orders/OrderContext";
import Spinner from "../../../common/Spinner";
import { getFormatDate } from "../../../../utils/formatDate";
import FilterBar from "../../../common/FilterBar";

export default function Orders() {
  const { orders, getAllOrders, loading } = useContext(OrderContext);
  const [filters, setFilters] = useState({ search: "", status: "" });

  useEffect(() => {
    getAllOrders();
  }, []);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    getAllOrders(filters);
  };

  const handleClear = () => {
    setFilters({ search: "", status: "" });
    getAllOrders();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const statusOK = filters.status ? order.status === filters.status : true;
    const dateOK = filters.date
      ? getFormatDate(order.createdAt) === filters.date
      : true;
    return statusOK && dateOK;
  });

  const headers = ["Order ID", "Customer", "Vendor", "Total", "Mode", "Date", "Status", "Actions"];

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
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Table + Pagination */}
      <PaginatedLayout data={filteredOrders} initialPerPage={10}>
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