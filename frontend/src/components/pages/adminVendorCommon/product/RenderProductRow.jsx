import { NavLink } from "react-router-dom";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import classNames from "classnames";
import StatusChip from "../../../common/helperComponents/StatusChip";
import { getFinalPrice } from "../../user/Utils/priceUtils";
import { formatNumber } from "../../../../utils/formatNumber";
import { toTitleCase } from "../../../../utils/titleCase";

export const RenderProductRow = (p, i, maxUnitsSold, isTopSellingPage = false, role = "admin") => {
  const isHighSales = (p.unitsSold || 0) >= maxUnitsSold * 0.6;

  return (
    <tr
      key={p._id}
      className={`hover:bg-blue-50 transition ${i !== 0 ? "border-t border-gray-200" : ""}`}
    >
      {/* Product (image + name) */}
      <td
        className="px-6 py-4 min-w-[300px] hover:scale-105 transition duration-150"
        title={toTitleCase(p.title) || "No Title"}
      >
        <NavLink to={`/${role}/product-details/${p._id}`} className="w-full flex items-center gap-4">
          <img
            src={p.images?.[0].url || "https://m.media-amazon.com/images/I/71Ls4akTeeL._AC_SL1500_.jpg"}
            alt={toTitleCase(p.title) || "Product Image"}
            className="w-[140px] h-12 rounded-lg object-cover shadow-md shadow-purple-400"
          />
          <span className="w-[160px] font-semibold text-gray-800 max-w-[160px] truncate">
            {toTitleCase(p.title) || "Untitled"}
          </span>
        </NavLink>
      </td>

      {/* ID */}
      <td
        className="px-6 py-4 min-w-[90px] text-blue-600 font-medium hover:underline hover:scale-105 transition duration-150 truncate"
        title={p._id || "No ID"}
      >
        <NavLink to={`/${role}/product-details/${p._id}`}>#{p._id || "N/A"}</NavLink>
      </td>

      {/* Brand */}
      <td
        className="px-6 py-4 min-w-[180px] hover:scale-105 transition duration-150"
        title={toTitleCase(p.brand) || "Unbranded"}
      >
        {toTitleCase(p.brand) || "Unbranded"}
      </td>

      {/* Category */}
      <td
        className="px-6 py-4 min-w-[180px] hover:scale-105 transition duration-150"
        title={toTitleCase(p.category?.name) || "Uncategorized"}
      >
        {toTitleCase(p.category?.name) || "Uncategorized"}
      </td>

      {/* Actual Price */}
      <td
        className="px-6 py-4 min-w-[120px] font-medium hover:scale-105 transition duration-150"
        title={`₹${p.price?.toLocaleString() || "0"}`}
      >
        ₹{formatNumber(p?.price) || "0"}
      </td>

      {/* Discount Price */}
      <td
        className="px-6 py-4 min-w-[200px] font-medium hover:scale-105 transition duration-150"
        title={`₹${getFinalPrice(p?.price, p?.discount)?.toLocaleString() || "0"}`}
      >
        <span>₹{formatNumber(getFinalPrice(p?.price, p?.discount)) || "0"}</span>{" "}
        <span className="text-sm text-gray-500">({p?.discount ? `${p.discount}%` : "Nil"})</span>
      </td>

      {/* Stock */}
      <td
        className="px-6 py-4 min-w-[90px] font-medium hover:scale-105 transition duration-150"
        title={`${p?.stock ?? 0} units`}
      >
        {formatNumber(p?.stock) || 0}
      </td>

      {/* Units sold */}
      <td
        className="px-6 py-4 min-w-[90px] font-medium hover:scale-105 transition duration-150"
        title={`${p?.unitsSold ?? 0} units`}
      >
        {formatNumber(p?.unitsSold) || 0}
      </td>

      {/* Revenue */}
      <td
        className="px-6 py-4 min-w-[90px] font-bold hover:scale-105 transition duration-150"
        title={`₹${p.totalRevenue?.toLocaleString() || "0"}`}
      >
        ₹{formatNumber(p?.totalRevenue) || "0"}
      </td>

      {/* Approval Status */}
      <td className={`${p.status === "pendingDeletion" ? "min-w-[170px]" : "min-w-[120px]"} px-6 py-4 hover:scale-105 transition duration-150`}>
        <StatusChip
          status={toTitleCase(p.status) || (isTopSellingPage ? "Approved" : "Unknown")}
        />
      </td>

      {/* Sales progress bar */}
      <td className="px-6 py-4 min-w-[180px] hover:scale-105 transition duration-150 relative">
        <p
          className={classNames("text-sm mb-1 font-semibold", {
            "text-green-600": isHighSales,
            "text-red-500": !isHighSales,
          })}
          title={`${p?.unitsSold ?? 0} sales`}
        >
          {formatNumber(p?.unitsSold) || 0} Sales
        </p>
        <div className="w-[80%] h-2 bg-gray-200 rounded-full overflow-hidden absolute bottom-5">
          <div
            className={classNames("h-full rounded-full", {
              "bg-green-500": isHighSales,
              "bg-red-400": !isHighSales,
            })}
            style={{
              width: `${maxUnitsSold ? Math.min((p.unitsSold / maxUnitsSold) * 100, 100) : 0}%`,
            }}
          ></div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 min-w-[120px] hover:scale-105 transition duration-150">
        <div className="flex items-center gap-3">
          <NavLink
            to={`/${role}/product-details/${p._id}`}
            title="View Product"
            className="hover:text-blue-600 hover:scale-110 transition duration-150"
          >
            <FiEye size={20} />
          </NavLink>

          <NavLink
            to={`/${role}/product/edit-delete/${p._id}`}
            title="Edit Product"
            className="hover:text-blue-600 hover:scale-110 transition duration-150"
          >
            <FiEdit size={20} />
          </NavLink>

          <NavLink
            to={`/${role}/product/edit-delete/${p._id}`}
            title="Delete Product"
            className="hover:text-red-600 hover:scale-110 transition duration-150"
          >
            <FiTrash2 size={20} />
          </NavLink>
        </div>
      </td>
    </tr>
  );
};
