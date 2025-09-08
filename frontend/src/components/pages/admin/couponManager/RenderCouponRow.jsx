// components/vendor/rows/RenderCouponRow.js
import { getFormatDate } from "../../../../utils/formatDate";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toTitleCase } from "../../../../utils/titleCase";
import { formatNumber } from "../../../../utils/formatNumber";

export const RenderCouponRow = (c, i, handleStartEdit, handleDelete) => {
  // Compute isActive based on usageLimit and expiryDate
  const isActive =
    Number(c.usageLimit) > 0 &&
    new Date(c.expiryDate) >= new Date();

  return (
    <tr
      key={c._id}
      className={`hover:bg-blue-50 transition ${i !== 0 ? "border-t border-gray-200" : ""}`}
    >
      {/* Coupon Code */}
      <td className="px-6 py-3 min-w-[10px] hover:scale-105 transition duration-150">
        <span
          className="font-medium text-gray-800 truncate max-w-[160px] group-hover:font-semibold"
          title={(c.code).toUpperCase() || "Coupon Code not available"}
        >
          {(c.code).toUpperCase() || "N/A"}
        </span>
      </td>

      {/* Discount */}
      <td
        className="px-6 py-3 min-w-[10px] font-bold hover:scale-105 transition duration-150"
        title={`₹${formatNumber(c.discount ?? 0)}` || "Discount not available"}
      >
        ₹{formatNumber(c.discount ?? 0)}
      </td>

      {/* Minimum Purchase */}
      <td
        className="px-6 py-3 min-w-[10px] hover:scale-105 transition duration-150"
        title={`₹${formatNumber(c.minPurchase ?? 0)}`}
      >
        ₹{formatNumber(c.minPurchase ?? 0)}
      </td>

      {/* Maximum Discount */}
      <td
        className="px-6 py-3 min-w-[10px] hover:scale-105 transition duration-150"
        title={`₹${formatNumber(c.maxDiscount ?? 0)}`}
      >
        ₹{formatNumber(c.maxDiscount ?? 0)}
      </td>

      {/* Status */}
      <td
        className="px-6 py-3 min-w-[10px] font-bold hover:scale-105 transition duration-150"
        title={`Status: ${isActive ? "Active" : "Inactive"}`}
      >
        <span className={`font-medium rounded-full px-2 text-sm ${isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
          {isActive ? <FaCheckCircle className="inline mr-1" /> : <FaTimesCircle className="inline mr-1" />}
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Expiry date */}
      <td
        className="px-6 py-3 min-w-[10px] hover:scale-105 transition duration-150"
        title={c.expiryDate ? getFormatDate(c.expiryDate) : "Date not available"}
      >
        {c.expiryDate ? getFormatDate(c.expiryDate) : "N/A"}
      </td>

      {/* Actions */}
      <td className="px-6 py-3 min-w-[10px] hover:scale-105 transition duration-150">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStartEdit(c)}
            className="hover:text-blue-600 transition cursor-pointer"
            title="Edit coupon"
          >
            <FiEdit size={22} />
          </button>
          <button
            onClick={() => handleDelete(c._id)}
            className="hover:text-red-600 transition cursor-pointer"
            title="Delete coupon"
          >
            <FiTrash2 size={22} />
          </button>
        </div>
      </td>
    </tr>
  );
};
