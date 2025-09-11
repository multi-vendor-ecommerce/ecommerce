import { useContext, useEffect, useState } from "react";
import OrderContext from "../../../../../context/orders/OrderContext";
import Loader from "../../../../common/Loader";
import { useNavigate } from "react-router-dom";
import StatusChip from "../../../../common/helperComponents/StatusChip";
import BackButton from "../../../../common/layout/BackButton";
import FilterBar from "../../../../common/FilterBar";
import { orderFilterFields } from "../../../adminVendorCommon/orders/data/ordersData.js";
import Button from "../../../../common/Button";
import { FiEye } from "react-icons/fi";

const MyOrdersList = () => {
  const { orders, getAllOrders, loading } = useContext(OrderContext);

  //  Filters & Pagination
  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  // Fetch Orders from context
  useEffect(() => {
    getAllOrders({ ...filters, page, limit: itemsPerPage });
  }, [page, itemsPerPage]);

  // Filter Handlers
  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setPage(1);
    getAllOrders({ ...filters, page: 1, limit: itemsPerPage });
  };

  const handleClear = () => {
    const cleared = { search: "", status: "", date: "" };
    setFilters(cleared);
    setPage(1);
    getAllOrders({ ...cleared, page: 1, limit: itemsPerPage });
  };

  const goToDetails = (orderId) => {
    navigate(`/my-orders/${orderId}`);
  };

  return (
    <div className="p-4 w-[90%] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

      <div className="mb-4">
        <BackButton />
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

      {loading ? (
        <div className="min-h-[50vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : !orders || orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found.</p>
      ) : (
        <div className="w-full grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-gray-100 bg-white shadow-sm 
                         transition-all duration-300 flex flex-col 
                         hover:shadow-lg hover:shadow-green-200 hover:border-green-300"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-4 py-3 border-b border-gray-100 rounded-t-xl bg-gray-50">
                <h3 className="font-medium text-gray-700 text-sm sm:text-base break-all">
                  Order ID:{" "}
                  <span className="font-semibold text-gray-900">
                    {order._id.toUpperCase()}
                  </span>
                </h3>
                <StatusChip status={order.orderStatus} />
              </div>

              {/* Items */}
              <div className="p-4 space-y-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
                  >
                    <div className="w-full sm:w-28 h-28 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                      <img
                        src={item?.product?.images?.[0]?.url || "/placeholder.png"}
                        alt={item?.product?.title || "Product"}
                        className="max-h-full max-w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 mx-2 mb-4 md:mx-0 md:mb-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                        {item?.product?.title || "Unknown Product"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: <span className="text-gray-800">{item?.quantity}</span>
                        {item?.size && (
                          <>
                            {" | "}
                            Size: <span className="text-gray-800">{item?.size}</span>
                          </>
                        )}
                        {item?.color && (
                          <>
                            {" | "}
                            Color: <span className="text-gray-800">{item?.color}</span>
                          </>
                        )}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-green-700 mt-1">
                        ₹{(item?.product?.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="w-full flex flex-row justify-between items-center gap-3 px-4 py-3 border-t border-gray-100 rounded-b-xl">
                <p className="text-gray-800 text-sm sm:text-base">
                  Total:{" "}
                  <span className="font-semibold">₹{(order?.totalAmount).toLocaleString()}</span>
                </p>
                <div>
                  {order?.orderStatus === "pending" ? (
                    <Button 
                      icon={FiEye}
                      text="Complete Your Order"
                      onClick={() => navigate(`/order-summary/${order?._id}`)}
                      className="py-2"
                      color="yellow"
                    />
                  ) : (
                    <Button
                      icon={FiEye}
                      text="View Details"
                      onClick={() => goToDetails(order?._id)}
                      className="py-2 text-sm md:text-base"
                      color="green"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersList;