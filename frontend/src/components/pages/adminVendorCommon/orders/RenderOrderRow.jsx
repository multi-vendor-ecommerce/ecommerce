import { NavLink } from "react-router-dom";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { getFormatDate } from "../../../../utils/formatDate";
import { toTitleCase } from "../../../../utils/titleCase";
import { formatNumber } from "../../../../utils/formatNumber";
import Button from "../../../common/Button";
import PushOrder from "./PushOrder";

export const RenderOrderRow = (order, index, StatusChip, role = "admin", vendorId = null, orderState = null, setOrderState = null, generateAWBForOrder = null) => (
  <>
    <tr
      key={order?._id || index}
      className={`hover:bg-blue-50 hover:shadow-sm transition ${index !== 0 ? "border-t border-gray-200" : ""}`}
    >
      {/* Order ID */}
      <td
        className="px-6 py-3 min-w-[50px] text-blue-600 font-medium hover:underline hover:scale-105 transition duration-150 truncate"
        title={`Order ID: ${order?._id}`}
      >
        <NavLink
          to={`/${role}/all-orders/order-details/${order?._id}`}
          title={`Order ID: ${order?._id}`}
        >
          #{order?._id}
        </NavLink>
      </td>

      {/* Customer Name */}
      <td
        className="px-6 py-3 min-w-[180px] hover:scale-105 transition duration-150"
        title={toTitleCase(order.user?.name) || "Unassigned Customer"}
      >
        {toTitleCase(order.user?.name) || "Unassigned Customer"}
      </td>

      {/* Vendor Name */}
      {role === "admin" && !vendorId && (
        <td
          className="px-6 py-3 min-w-[180px] hover:scale-105 hover:underline hover:font-semibold transition duration-150"
          title={toTitleCase(order.orderItems?.[0]?.product?.createdBy?.name) || "Unassigned Vendor"}
        >
          <NavLink
            to={`/admin/vendor/profile/${order.orderItems?.[0]?.product?.createdBy?._id || ""}`}
            title={toTitleCase(order.orderItems?.[0]?.product?.createdBy?.name) || "Unassigned Vendor"}
          >
            {toTitleCase(order.orderItems?.[0]?.product?.createdBy?.name) || "Unassigned Vendor"}
          </NavLink>
        </td>
      )}

      {/* First Product Title */}
      <td
        className="px-6 py-3 min-w-[300px] hover:scale-105 transition duration-150"
        title={toTitleCase(order.orderItems?.[0]?.product?.title) || "No Products"}
      >
        {toTitleCase(order.orderItems?.[0]?.product?.title) || "No Products"}
        {order.orderItems?.length > 1 && (
          <span className="font-semibold"> +{order.orderItems.length - 1} more</span>
        )}
      </td>

      {/* Payment Method */}
      <td
        className="px-6 py-3 min-w-[120px] hover:scale-105 transition duration-150"
        title={order.paymentMethod || "N/A"}
      >
        {order.paymentMethod || "N/A"}
      </td>

      {/* Order Date */}
      <td
        className="px-6 py-3 min-w-[180px] hover:scale-105 transition duration-150"
        title={order.createdAt ? getFormatDate(order.createdAt) : "N/A"}
      >
        {getFormatDate(order.createdAt)}
      </td>

      {/* Order Status */}
      <td
        className="px-6 py-3 min-w-[140px] hover:scale-105 transition duration-150"
        title={role === "vendor" ? (toTitleCase(order?.orderItems?.[0]?.originalShiprocketStatus) || order.orderStatus) : order.orderStatus}
      >
        <StatusChip status={role === "vendor" ? (toTitleCase(order?.orderItems?.[0]?.originalShiprocketStatus) || order.orderStatus) : order?.orderStatus} />
      </td>

      {/* Shipping details */}
      {(order.orderItems?.[0]?.shiprocketAWB || order.orderItems?.[0]?.courierName) && (
        <td
          className="px-6 py-3 min-w-[190px] font-semibold hover:scale-105 transition duration-150"
          title={`
          Shipping AWB: ${order.orderItems?.[0]?.shiprocketAWB || 'N/A'} 
          Shipping Courier Name: ${order.orderItems?.[0]?.courierName || 'N/A'}
        `}
        >
          AWB:<span className="font-normal"> {order.orderItems?.[0]?.shiprocketAWB || 'N/A'}</span>{" "}
          Courier:<span className="font-normal"> {order.orderItems?.[0]?.courierName || 'N/A'}</span>
        </td>
      )}

      {/* Total Amount */}
      <td
        className="px-6 py-3 min-w-[120px] font-semibold hover:scale-105 transition duration-150"
        title={`₹${order.grandTotal || 0}`}
      >
        ₹{formatNumber(order.grandTotal || 0)}
      </td>

      {/* Actions */}
      <td
        className={`${role === "vendor" ? "px-6 py-3 min-w-[250px]" : "px-6 py-3 min-w-[120px]"}`}
      >
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

          {/* Push Order button (Vendor only, status: processing) */}
          {role === "vendor" && orderState !== null &&
            (order?.orderStatus === "processing" && order?.orderItems?.[0]?.originalShiprocketStatus === "") && (
              <Button
                text="Push Order"
                onClick={() => {
                  setOrderState({ isButtonClick: true, orderId: order._id });
                }}
                disabled={orderState.isButtonClick && orderState.orderId === order._id}
                className="py-1 text-sm"
                color="green"
              />
            )}

          {role === "vendor" && orderState !== null &&
            (order?.orderItems?.[0]?.originalShiprocketStatus === "new") && (
              <Button
                text="Assign AWB"
                onClick={() => {
                  generateAWBForOrder(order?._id);
                  setOrderState({ isButtonClick: true, orderId: order._id });
                }}
                disabled={orderState.isButtonClick && orderState.orderId === order._id}
                className="py-1 text-sm"
                color="green"
              />
            )}
        </div>
      </td>
    </tr>
    {orderState && orderState?.isButtonClick &&
      role === "vendor" &&
      orderState.orderId === order._id &&
      (order?.orderStatus === "processing" && order?.orderItems?.[0]?.originalShiprocketStatus === "") && (
        <tr>
          <td colSpan={9} className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <PushOrder orderId={order._id} setOrderState={setOrderState} />
          </td>
        </tr>
      )}
  </>
);
