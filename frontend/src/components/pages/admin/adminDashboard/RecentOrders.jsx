import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import OrderContext from "../../../../context/orders/OrderContext";
import TabularData from "../../../common/layout/TabularData";
import { RenderOrderRow } from "../../adminVendorCommon/orders/RenderOrderRow";
import ShowLessMore from "../../../common/helperComponents/ShowLessMore";
import Spinner from "../../../common/Spinner";
import StatusChip from "../../../common/helperComponents/StatusChip";

const RecentOrders = () => {
  const { orders, loading } = useContext(OrderContext);
  const [showAll, setShowAll] = useState(false);

  const ordersToShow = showAll ? orders : orders.slice(0, 5);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      {loading ? (
        <div className="flex justify-center"><Spinner /></div>
      ) : (
        <>
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
              headers={["Order ID", "Customer", "Vendor", "Total", "Mode", "Date", "Status", "Actions"]}
              data={ordersToShow}
              renderRow={(o, i) => RenderOrderRow(o, i, StatusChip)}
              emptyMessage="No orders found."
            />
          </div>

          <ShowLessMore showAll={showAll} toggleShowAll={() => setShowAll((prev) => !prev)} condition={orders.length > 5} />
        </>
      )}
    </section>
  );
};

export default RecentOrders;
