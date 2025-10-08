import { useState, useContext, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import StatusChip from "../../../common/helperComponents/StatusChip";
import { orderFilterFields } from "./data/orderFilterFields";
import { RenderOrderRow } from "./RenderOrderRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import OrderContext from "../../../../context/orders/OrderContext";
import Loader from "../../../common/Loader";
import FilterBar from "../../../common/FilterBar";
import BackButton from "../../../common/layout/BackButton";
import TabBar from "../../../common/TabBar";
import { shiprocketTabs } from "./data/orderFilterFields";
import { toTitleCase } from "../../../../utils/titleCase";

export default function Orders({ role = "admin", vendorId = null }) {
  const { orders, getAllOrders, loading, totalCount, generateAWBForOrder } = useContext(OrderContext);

  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orderState, setOrderState] = useState({
    isButtonClick: false,
    orderId: ""
  });

  // 🔹 Regular fetch (for Apply button, pagination, etc.)
  const fetchOrders = useCallback(() => {
    getAllOrders({ ...filters, vendorId, page, limit: itemsPerPage });
  }, [filters, vendorId, page, itemsPerPage, getAllOrders]);

  useEffect(() => {
    fetchOrders();
  }, [vendorId, page, itemsPerPage]); // ← normal re-fetch on page/limit change

  // 🔹 Debounced fetch for search field only
  useEffect(() => {
    if (filters.search.trim() !== "") {
      const debounced = debounce(() => {
        getAllOrders({ ...filters, vendorId, page: 1, limit: itemsPerPage });
      }, 500);
      debounced();
      return () => debounced.cancel();
    }
  }, [filters.search, vendorId, itemsPerPage]);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tabKey) => {
    const formattedTabKey = toTitleCase(tabKey);
    setActiveTab(tabKey);
    setFilters((prev) => ({ ...prev, status: formattedTabKey }));
    setPage(1);
    getAllOrders({ ...filters, status: tabKey, vendorId, page: 1, limit: itemsPerPage });
  };

  const handleApply = () => {
    setPage(1);
    fetchOrders();
  };

  const handleClear = () => {
    const cleared = { search: "", status: "", date: "" };
    setFilters(cleared);
    setActiveTab("");
    setPage(1);
    getAllOrders({ ...cleared, vendorId, page: 1, limit: itemsPerPage });
  };

  const handlePageChange = (pg) => setPage(pg);
  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setPage(1);
  };

  const hasDocuments = orders?.some(order =>
    order.orderItems?.some(item => item.labelUrl || item.invoiceUrl || item.manifestUrl)
  );

  const headers = [
    "Order ID",
    "Customer",
    ...(role === "admin" && !vendorId ? ["Vendor"] : []),
    "Total",
    "Mode",
    "Date",
    "Status",
    ...(orders?.some(order => order.orderItems?.some(item => item.shiprocketAWB)) ? ["Shipping Details"] : []),
    "Amount",
    "Actions",
    ...(hasDocuments ? ["Documents"] : [])
  ];

  if (loading && orders.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  const filteredFields = role === "vendor"
    ? orderFilterFields.filter(
      field => ["search", "date"].includes(field.name)
    )
    : orderFilterFields;

  return (
    <section className={`min-h-screen ${!vendorId && "bg-gray-100 p-6 shadow-md"}`}>
      {!vendorId && <BackButton />}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mt-4 mb-6">
        {!vendorId && (
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">All Orders</h2>
        )}
        <FilterBar
          fields={filteredFields}
          values={filters}
          onChange={handleChange}
          onApply={handleApply}
          onClear={handleClear}
        />
      </div>

      {role === "vendor" && (
        <div>
          <TabBar
            tabs={shiprocketTabs}
            activeTab={activeTab}
            onChange={handleTabChange}
            className="mt-10 mb-2"
          />
        </div>
      )}

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
              renderRow={(o, i) => RenderOrderRow(o, i, StatusChip, role, vendorId, orderState, setOrderState, generateAWBForOrder)}
              emptyMessage="No orders found."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}