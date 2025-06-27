import { useState } from "react";
import { Link } from "react-router-dom";
import StatusChip from "../helperComponents/StatusChip";
import { ordersDummy } from "../adminOrders/data/ordersData";
import OrdersData from "../adminOrders/OrdersData";

const RecentOrders = () => {
  const [showAll, setShowAll] = useState(false);
  const ordersToShow = showAll ? ordersDummy : ordersDummy.slice(0, 5);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      <div className="min-h-16 flex justify-between items-center mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Recent Orders</h2>
        <Link
          to="/admin/all-orders"
          className="border-gray-300 px-2 md:px-4 py-2 rounded-xl text-sm md:text-[16px] font-medium text-black hover:text-blue-500 border-2 hover:border-blue-500 transition cursor-pointer"
        >
          View Orders
        </Link>
      </div>

      <div>
        <OrdersData orders={ordersToShow} StatusChip={StatusChip} />
      </div>

      <div>
        {ordersDummy.length > 5 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentOrders;
