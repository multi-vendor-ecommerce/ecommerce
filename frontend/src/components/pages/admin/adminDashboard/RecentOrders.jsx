import { useState } from "react";
import { NavLink } from "react-router-dom";
import StatusChip from "../helperComponents/StatusChip";
import { ordersDummy } from "../adminOrders/data/ordersData";
import TabularData from "../../../common/layout/TabularData";
import { RenderOrderRow } from "../adminOrders/RenderOrderRow";
import ShowLessMore from "../../../common/helperComponents/ShowLessMore";

const RecentOrders = () => {
  const [showAll, setShowAll] = useState(false);
  const ordersToShow = showAll ? ordersDummy : ordersDummy.slice(0, 5);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      <div className="min-h-16 flex justify-between items-center mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Recent Orders</h2>
        <NavLink
          to="/admin/all-orders"
          className="border-gray-300 px-2 md:px-4 py-2 rounded-xl text-sm md:text-[16px] font-medium text-black hover:text-blue-500 border-2 hover:border-blue-500 transition cursor-pointer"
        >
          View Orders
        </NavLink>
      </div>

      <div>
        <TabularData
          headers={["Order ID", "Customer", "Date", "Total", "Status", "Actions"]}
          data={ordersToShow}
          renderRow={(o, i) => RenderOrderRow(o, i, StatusChip)}
          emptyMessage="No orders found."
          widthClass="w-full"
        />
      </div>

      <ShowLessMore showAll={showAll} toggleShowAll={() => setShowAll((prev) => !prev)} condition={ordersDummy.length > 5} />
    </section>
  );
};

export default RecentOrders;
