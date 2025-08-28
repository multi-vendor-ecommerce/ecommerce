import { useContext, useEffect, useState } from "react";
import OrderContext from "../../../../../context/orders/OrderContext";
import Loader from "../../../../common/Loader";
import { useNavigate } from "react-router-dom";
import StatusChip from "../../../../common/helperComponents/StatusChip";
import BackButton from "../../../../common/layout/BackButton";

const MyOrdersList = () => {
  const { getAllOrders } = useContext(OrderContext);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setMyOrders(res.orders || []);
    } catch (error) {
      console.error("Error fetching my orders:", error);
      setMyOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const goToDetails = (orderId) => {
    navigate(`/my-orders/${orderId}`);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
      <div className="mb-4">
        <BackButton />
      </div>
      {loading ? (
        <div className="min-h-[50vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : myOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base break-all">
                  Order ID: {order._id.toUpperCase()}
                </h3>
                <StatusChip status={order.orderStatus} />
              </div>

              {/* Items */}
              <div className="p-4 grid gap-1">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition"
                  >
                    {/* Image */}
                    <div className="w-full sm:w-30 h-30  flex-shrink-0 flex items-center justify-center bg-gray  overflow-hidden">
                      <img
                        src={item?.product?.images?.[0]?.url || "/placeholder.png"}
                        alt={item?.product?.title || "Product"}
                        className="max-h-full max-w-full object-cover"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                        {item.size && ` | Size: ${item.size}`}
                        {item.color && ` | Color: ${item.color}`}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-green-700 mt-1">
                        ₹{item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-t border-gray-100">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  Total: ₹{order.totalAmount}
                </p>
                <button
                  onClick={() => goToDetails(order._id)}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersList;
