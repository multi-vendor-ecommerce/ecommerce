import { useState, useContext, useCallback } from "react";
import OrderContext from "../../../../../context/orders/OrderContext";
import InfiniteScroller from "../../../../common/InfiniteScroller";
import BackButton from "../../../../common/layout/BackButton";
import FilterBar from "../../../../common/FilterBar";
import { orderFilterFields } from "../../../adminVendorCommon/orders/data/orderFilterFields.js";
import { useNavigate } from "react-router-dom";
import RenderOrderItem from "./RenderOrderItem.jsx";

const MyOrdersList = () => {
  const navigate = useNavigate();
  const { getAllOrders } = useContext(OrderContext);

  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  // new states
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [noOrders, setNoOrders] = useState(false);

  // handleChange
  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply (force reload)
  const handleApply = () => {
    setFiltersApplied(true);
    setRefreshKey((k) => k + 1);
  };

  // Clear filters
  const handleClear = () => {
    setFilters({ search: "", status: "", date: "" });
    setFiltersApplied(false);
    setRefreshKey((k) => k + 1);
  };

  // API fetch
  const fetchOrders = useCallback(
    async (page = 1, limit = 10) => {
      try {
        const res = await getAllOrders({ ...filters, page, limit });
        const orders = res?.orders || [];

        // if filters applied, check empty
        if (filtersApplied && page === 1) {
          setNoOrders(orders.length === 0);
        }

        return orders;
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (filtersApplied && page === 1) setNoOrders(true);
        return [];
      }
    },
    [filters, filtersApplied, getAllOrders]
  );

  // Order details navigation
  const goToDetails = (orderId) => {
    navigate(`/my-orders/${orderId}`);
  };

  return (
    <div className="p-4 w-[90%] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

      <div className="mb-4">
        <BackButton className="border-green-500 hover:bg-green-700" />
      </div>

      {/* FilterBar */}
      <div className="mb-8">
        <FilterBar
          fields={orderFilterFields}
          values={filters}
          onChange={handleChange}
          onApply={handleApply}
          onClear={handleClear}
        />
      </div>

      {/* Infinite Scroll */}
      <div
        id="scrollableDiv"
        className="w-full overflow-y-auto max-h-[70vh] pr-2"
      >
        {!noOrders ? (
          <InfiniteScroller
            key={refreshKey}
            fetchData={fetchOrders}
            orientation="vertical"
            pageSize={10}
            renderItem={(order) => (
              <RenderOrderItem order={order} goToDetails={goToDetails} />
            )}
            wrapperClassName="w-full grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4"
          />
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No orders found for the selected filters
          </p>
        )}
      </div>
    </div>
  );
};

export default MyOrdersList;
