import { Link } from "react-router-dom";
import { FiEye, FiTrash2 } from "react-icons/fi";

/* Accept orders + StatusChip from parent */
const OrdersData = ({ orders = [], StatusChip }) => {
  return (
    <div className="bg-white rounded-xl overflow-x-auto">
      <table className="w-full text-left text-gray-600">
        <thead className="bg-gray-50 uppercase text-sm text-gray-500">
          <tr>
            {["Order No", "Date", "Product", "Status", "Action"].map((h) => (
              <th key={h} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((o, i) => (
              <tr
                key={o.orderNo}
                className={`hover:bg-blue-50 hover:shadow-sm transition ${
                  i !== 0 ? "border-t border-gray-200" : ""
                }`}
              >
                <td className="px-4 py-3 text-blue-600 font-medium hover:scale-105 transition duration-150" title="Order Number">
                  #{o.orderNo}
                </td>
                <td className="px-4 py-3 hover:scale-105 transition duration-150" title="Order Date">
                  {o.date}
                </td>

                {/* product name(s) */}
                <td className="px-4 py-3 hover:scale-105 transition duration-150" title="Products Name">
                  {o.products[0].name}
                  {o.products.length > 1 && (
                    <span className="font-semibold"> +{o.products.length - 1} more</span>
                  )}
                </td>

                {/* status chip from props */}
                <td className="px-4 py-3 hover:scale-105 transition duration-150" title={o.status}>
                  <StatusChip status={o.status} />
                </td>

                {/* actions */}
                <td className="px-4 py-3 hover:scale-105 transition duration-150">
                  <div className="flex items-center gap-4">
                    <Link
                      to={`order-details/${o.orderNo}`}
                      title="View order"
                      className="hover:text-blue-600 transition"
                    >
                      <FiEye size={18} />
                    </Link>

                    <button
                      title="Delete order"
                      className="hover:text-red-600 transition"
                      onClick={() => console.log("TODO: delete", o.orderNo)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersData;
