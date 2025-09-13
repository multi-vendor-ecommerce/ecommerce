import { useState, useContext, useCallback } from "react";
import OrderContext from "../../../../../context/orders/OrderContext";
import InfiniteScroller from "../../../../common/InfiniteScroller";
import BackButton from "../../../../common/layout/BackButton";
import FilterBar from "../../../../common/FilterBar";
import { orderFilterFields } from "../../../adminVendorCommon/orders/data/ordersData.js";
import { useNavigate } from "react-router-dom";
import RenderOrderItem from "./renderOrderItem";

const MyOrdersList = () => {
  const navigate = useNavigate();
  const { getAllOrders } = useContext(OrderContext);

  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  // handleChange
  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply (force reload)
  const handleApply = () => {
    setRefreshKey((k) => k + 1); // ✅ reset InfiniteScroller
  };

  // Clear filters
  const handleClear = () => {
    setFilters({ search: "", status: "", date: "" });
    setRefreshKey((k) => k + 1); // ✅ reset InfiniteScroller
  };

  // API fetch
  const fetchOrders = useCallback(
    async (page = 1, limit = 10) => {
      try {
        const res = await getAllOrders({ ...filters, page, limit });
        return res?.orders || [];
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        return [];
      }
    },
    [filters, getAllOrders]
  );

  // Order details navigation
  const goToDetails = (orderId) => {
    navigate(`/my-orders/${orderId}`);
  };

  return (
    <div className="p-4 w-[90%] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

      <div className="mb-4">
        <BackButton />
      </div>

      {/* 🔹 FilterBar */}
      <div className="mb-8">
        <FilterBar
          fields={orderFilterFields}
          values={filters}
          onChange={handleChange}
          onApply={handleApply}
          onClear={handleClear}
        />
      </div>

      {/* 🔹 Infinite Scroll */}
      <div
        id="scrollableDiv"
        className="w-full overflow-y-auto max-h-[70vh] pr-2"
      >
        <InfiniteScroller
          key={refreshKey} //  reset list only when Apply / Clear pressed
          fetchData={fetchOrders}
          orientation="vertical"
          pageSize={10}
          renderItem={(order) => <RenderOrderItem order={order} goToDetails={goToDetails} />}
          wrapperClassName="w-full grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4"
        />
      </div>
    </div>
  );
};

export default MyOrdersList;
