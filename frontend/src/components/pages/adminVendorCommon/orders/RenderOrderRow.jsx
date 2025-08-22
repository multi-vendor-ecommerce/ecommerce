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

export const RenderOrderRow = (order, index, StatusChip, role = "admin") => (
  <tr
    key={index}
    className={`hover:bg-blue-50 hover:shadow-sm transition ${index !== 0 ? "border-t border-gray-200" : ""}`}
  >
    {/* Order ID */}
    <td className="px-6 py-3 min-w-[100px] text-blue-600 font-medium hover:underline hover:scale-105 transition duration-150">
      <NavLink
        to={`/${role}/all-orders/order-details/${order._id}`}
        title="Order ID"
      >
        #{order._id}
      </NavLink>
    </td>

    {/* Customer Name */}
    <td className="px-6 py-3 min-w-[180px] hover:scale-105 transition duration-150">
      {order.user?.name || "Unassigned Customer"}
    </td>

    {/* Vendor Name */}
    {role === "admin" && (
      <td className="px-6 py-3 min-w-[180px] hover:scale-105 hover:underline hover:font-semibold transition duration-150">
        <NavLink
          to={`/admin/vendor/profile/${order.orderItems?.[0]?.product?.createdBy?._id || ""}`}
          title="Vendor Name"
        >
          {order.orderItems?.[0]?.product?.createdBy?.name || "Unassigned Vendor"}
        </NavLink>
      </td>
    )}

    {/* First Product Title */}
    <td className="px-6 py-3 min-w-[300px] hover:scale-105 transition duration-150">
      {order.orderItems?.[0]?.product?.title || "No Products"}
      {order.orderItems?.length > 1 && (
        <span className="font-semibold"> +{order.orderItems.length - 1} more</span>
      )}
    </td>

    {/* Payment Method */}
    <td className="px-6 py-3 min-w-[120px] hover:scale-105 transition duration-150">
      {order.paymentMethod || "N/A"}
    </td>

    {/* Order Date */}
    <td className="px-6 py-3 min-w-[180px] hover:scale-105 transition duration-150">
      {getFormatDate(order.createdAt)}
    </td>

    {/* Order Status */}
    <td className="px-6 py-3 min-w-[140px] hover:scale-105 transition duration-150">
      <StatusChip status={order.orderStatus} />
    </td>

    {/* Total Amount */}
    <td className="px-6 py-3 min-w-[120px] font-semibold hover:scale-105 transition duration-150">
      ₹{order.totalAmount}
    </td>

    {/* Actions */}
    <td className="px-6 py-3 min-w-[160px] hover:scale-105 transition duration-150">
      <div className="inline-flex items-center gap-4">
        <NavLink
          to={`/${role}/all-orders/order-details/${order._id}`}
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
