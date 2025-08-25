import { useContext, useEffect, useState } from "react";
import OrderContext from "../../../../../context/orders/OrderContext";
import Loader from "../../../../common/Loader";
import { useNavigate } from "react-router-dom";

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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>

      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : myOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  Order ID: {order._id.toUpperCase()}
                </h3>
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    order.orderStatus === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.orderStatus === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-2">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 border-b py-2 last:border-0"
                  >
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.product.title}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} | Size: {item.size} | Color:{" "}
                        {item.color}
                      </p>
                      <p className="text-sm font-semibold">₹{item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-3">
                <p className="font-semibold">Total: ₹{order.totalAmount}</p>
                <button
                  onClick={() => goToDetails(order._id)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
