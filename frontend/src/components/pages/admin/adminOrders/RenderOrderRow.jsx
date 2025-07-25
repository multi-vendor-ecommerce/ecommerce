import { NavLink } from "react-router-dom";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { getFormatDate } from "../../../../utils/formatDate";

/**
 * Renders a single order row for the admin order table.
 *
 * @param {Object} order - The order object containing all details.
 * @param {number} index - The index of the row.
 * @param {function} StatusChip - A component that renders the order status visually.
 */
export const RenderOrderRow = (order, index, StatusChip) => (
  <tr
    key={index}
    className={`hover:bg-blue-50 hover:shadow-sm transition ${index !== 0 ? "border-t border-gray-200" : ""}`}
  >
    {/* Order ID */}
    <td className="px-6 py-3 min-w-[120px] text-blue-600 font-medium hover:underline hover:scale-105 transition duration-150">
      <NavLink
        to={`/admin/all-orders/order-details/${order._id}`}
        title="Order ID"
      >
        #{order._id}
      </NavLink>
    </td>

    {/* Customer Name */}
    <td className="px-6 py-3 min-w-[140px] hover:scale-105 transition duration-150">
      {order.user?.name || "Customer"}
    </td>

    {/* Vendor Name */}
    <td className="px-6 py-3 min-w-[140px] hover:scale-105 transition duration-150">
      {order.vendor?.name || "Vendor"}
    </td>

    {/* Total Products */}
    <td className="px-6 py-3 min-w-[140px] hover:scale-105 transition duration-150">
      {order.products?.[0]?.product?.title || "No Products"}
      {order.products?.length > 1 && (
        <span className="font-semibold"> +{order.products.length - 1} more</span>
      )}
    </td>

    {/* Mode of Delivery */}
    <td className="px-6 py-3 min-w-[120px] hover:scale-105 transition duration-150">
      {order.paymentMethod}
    </td>

    {/* Order Date */}
    <td className="px-6 py-3 min-w-[140px] hover:scale-105 transition duration-150">
      {getFormatDate(order.createdAt)}
    </td>

    {/* Status */}
    <td className="px-6 py-3 min-w-[140px] hover:scale-105 transition duration-150">
      <StatusChip status={order.status} />
    </td>

    {/* Actions */}
    <td className="px-6 py-3 min-w-[160px] hover:scale-105 transition duration-150">
      <div className="inline-flex items-center gap-4">
        <NavLink
          to={`/admin/all-orders/order-details/${order._id}`}
          title="View order"
          className="hover:text-blue-600 hover:scale-110 transition duration-150"
        >
          <FiEye size={20} />
        </NavLink>

        <button
          title="Delete order"
          className="hover:text-red-600 hover:scale-110 transition duration-150 cursor-pointer"
          onClick={() => console.log("TODO: delete", order._id)}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </td>
  </tr>
);
