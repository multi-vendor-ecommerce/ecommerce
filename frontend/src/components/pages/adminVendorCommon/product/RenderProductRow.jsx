import { NavLink } from "react-router-dom";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import classNames from "classnames";
import StatusChip from "../../../common/helperComponents/StatusChip";

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
        title={p.title || "No Title"}
      >
        <NavLink to={`/${role}/product-details/${p._id}`} className="w-full flex items-center gap-4">
          <img
            src={p.images?.[0].url || "https://m.media-amazon.com/images/I/71Ls4akTeeL._AC_SL1500_.jpg"}
            alt={p.title || "Product Image"}
            className="w-[140px] h-12 rounded-lg object-cover shadow-md shadow-purple-400"
          />
          <span className="w-[160px] font-semibold text-gray-800 max-w-[160px] truncate">
            {p.title || "Untitled"}
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

      {/* Category */}
      <td
        className="px-6 py-4 min-w-[180px] hover:scale-105 transition duration-150"
        title={p.category?.name || "Uncategorized"}
      >
        {p.category?.name || "Uncategorized"}
      </td>

      {/* Price */}
      <td
        className="px-6 py-4 min-w-[120px] font-medium hover:scale-105 transition duration-150"
        title={`₹${p.price?.toLocaleString() || "0"}`}
      >
        ₹{p.price > 0 ? p.price.toLocaleString() : "0"}
      </td>

      {/* Units sold */}
      <td
        className="px-6 py-4 min-w-[120px] font-medium hover:scale-105 transition duration-150"
        title={`${p.unitsSold ?? 0} units`}
      >
        {p.unitsSold ?? 0}
      </td>

      {/* Revenue */}
      <td
        className="px-6 py-4 min-w-[140px] font-bold hover:scale-105 transition duration-150"
        title={`₹${p.totalRevenue?.toLocaleString() || "0"}`}
      >
        ₹{p.totalRevenue?.toLocaleString() || "0"}
      </td>

      {/* Approval Status */}
      <td className="px-6 py-3 min-w-[200px]">
        <StatusChip
          status={p.status || (isTopSellingPage ? "approved" : "Unknown")}
        />
      </td>

      {/* Sales progress bar */}
      <td className="px-6 py-4 min-w-[220px] hover:scale-105 transition duration-150 relative">
        <p
          className={classNames("text-sm mb-1 font-semibold", {
            "text-green-600": isHighSales,
            "text-red-500": !isHighSales,
          })}
          title={`${p.unitsSold?.toLocaleString() || 0} sales`}
        >
          {p.unitsSold?.toLocaleString() || 0} Sales
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
      <td className="px-6 py-4 min-w-[100px] hover:scale-105 transition duration-150">
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

          <button
            title="Delete Product"
            className="hover:text-red-600 hover:scale-110 transition duration-150"
            onClick={() => console.log("TODO: delete", p._id)}
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
};
