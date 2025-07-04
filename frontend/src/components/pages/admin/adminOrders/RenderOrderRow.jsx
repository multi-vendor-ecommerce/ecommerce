// components/admin/orders/renderOrderRow.jsx
import { NavLink } from "react-router-dom";
import { FiEye, FiTrash2 } from "react-icons/fi";

export const RenderOrderRow = (order, index, StatusChip) => (
  <tr
    key={order.orderNo}
    className={`hover:bg-blue-50 hover:shadow-sm transition ${index !== 0 ? "border-t border-gray-200" : ""}`}
  >
    {/* Order No */}
    <td className="px-4 py-3 text-blue-600 font-medium hover:scale-105 transition duration-150 hover:underline">
      <NavLink to={`/admin/orders/order-details/${order.orderNo}`}>
        #{order.orderNo}
      </NavLink>
    </td>

    {/* Customer */}
    <td className="px-4 py-3 hover:scale-105 transition duration-150">
      {order.customer?.name}
    </td>

    {/* Date */}
    <td className="px-4 py-3 hover:scale-105 transition duration-150">
      {order.date}
    </td>

    {/* Products */}
    <td className="px-4 py-3 hover:scale-105 transition duration-150">
      {order.products?.[0]?.name}
      {order.products?.length > 1 && (
        <span className="font-semibold"> +{order.products.length - 1} more</span>
      )}
    </td>

    {/* Status */}
    <td className="px-4 py-3 hover:scale-105 transition duration-150">
      <StatusChip status={order.status} />
    </td>

    {/* Actions */}
    <td className="px-4 py-3 hover:scale-105 transition duration-150">
      <div className="flex items-center gap-4">
        <NavLink
          to={`order-details/${order.orderNo}`}
          title="View order"
          className="hover:text-blue-600 hover:scale-110 transition duration-150"
        >
          <FiEye size={20} />
        </NavLink>
        <button
          title="Delete order"
          className="hover:text-red-600 hover:scale-110 transition duration-150 cursor-pointer"
          onClick={() => console.log("TODO: delete", order.orderNo)}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </td>
  </tr>
);
