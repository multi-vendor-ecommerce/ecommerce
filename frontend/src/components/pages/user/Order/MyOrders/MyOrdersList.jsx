import { useContext, useEffect, useState } from "react"
import OrderContext from "../../../../../context/orders/OrderContext"
import Loader from "../../../../common/Loader";

const MyOrdersList = () => {
  const { getAllOrders } = useContext(OrderContext);

  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, []); 

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const orders = await getAllOrders();
      setMyOrders(orders);
    } catch (error) {
      console.log("Error fetching my orders: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>My Orders</h2>

      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : myOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {myOrders.map((order, index) => (
            <li key={order.id || index}>
              {order.name || `Order #${index + 1}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrdersList;
