import StatusChip from "../../../../common/helperComponents/StatusChip";
import Button from "../../../../common/Button";
import { FiCheck, FiCheckCircle, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RenderOrderItem = ({ order, goToDetails }) => {
  const navigate = useNavigate();

  return (
    <div
      key={order._id}
      className="min-h-[200px] rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-green-200 hover:border-green-300 mb-4"
    >
      {/* Header */}
      <div className="flex flex-row justify-between items-center gap-2 px-4 py-3 border-b border-gray-200 rounded-t-xl bg-gray-50">
        <h3 className="font-medium text-gray-700 text-sm md:text-base break-all truncate">
          Order ID:{" "}
          <span className="font-semibold text-gray-900">
            {order._id.toUpperCase()}
          </span>
        </h3>
        <StatusChip status={order.orderStatus} />
      </div>

      {/* Items */}
      <div className="p-4 space-y-3">
        <div
          key={order.orderItems[0]?._id}
          className="flex flex-col md:flex-row md:items-center gap-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
        >
          <div className="w-full md:w-28 h-28 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg bg-white">
            <img
              src={order.orderItems[0]?.product?.images?.[0]?.url || "/placeholder.png"}
              alt={order.orderItems[0]?.product?.title || "Product"}
              className="max-h-full max-w-full object-cover"
            />
          </div>
          <div className="flex flex-col md:flex-row flex-1 justify-between pr-3.5 mx-2 mb-4 md:mx-0 md:mb-0">
            <div>
              <p className="text-sm md:text-base font-medium text-gray-900 line-clamp-2">
                {order.orderItems[0]?.product?.title || "Unknown Product"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Qty: <span className="text-gray-800">{order.orderItems[0]?.quantity}</span>
                {order.orderItems[0]?.size && (
                  <>
                    {" | "}
                    <span className="text-gray-800">Size: {order.orderItems[0]?.size}</span>
                  </>
                )}
                {order.orderItems[0]?.color && (
                  <>
                    {" | "}
                    <span className="text-gray-800">Color: {order.orderItems[0]?.color}</span>
                  </>
                )}
              </p>
              <p className="text-sm md:text-base font-semibold text-green-700 mt-1">
                ₹{order.orderItems[0]?.product?.price.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2 flex items-end">
              Total product in order: {order.orderItems?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 px-4 py-3 border-t border-gray-200 rounded-b-xl">
        <p className="text-gray-800 text-sm md:text-base">
          Grand Total:{" "}
          <span className="font-semibold">
            ₹{order?.grandTotal.toLocaleString()}
          </span>
        </p>
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          {order?.orderStatus === "pending" ? (
            <Button
              icon={FiCheckCircle}
              text="Complete Order"
              onClick={() => navigate(`/order-summary/${order?._id}`)}
              className="py-2 text-ms md:text-base"
              color="yellow"
            />
          ) : (
            <Button
              icon={FiEye}
              text="View All"
              onClick={() => goToDetails(order?._id)}
              className="py-2 text-sm md:text-base"
              color="green"
            />
          )}
          <a
            href={order.userInvoiceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2.5 py-2 md:px-4 text-blue-600 hover:bg-blue-600  border font-semibold rounded-lg transition duration-150 hover:text-white cursor-pointer"
          >
            <FiEye size={20} />
            View Invoice
          </a>
        </div>
      </div>
    </div>
  );
};

export default RenderOrderItem;