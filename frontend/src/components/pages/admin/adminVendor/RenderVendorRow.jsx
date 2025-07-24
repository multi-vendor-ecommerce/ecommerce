// components/vendor/rows/renderVendorRow.js
import { NavLink } from "react-router-dom";
import { getFormatDate } from "../../../../utils/formatDate";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";

export const RenderVendorRow = (v, i) => (
  <tr
    key={v._id}
    className={`hover:bg-blue-50 transition ${i !== 0 ? "border-t border-gray-200" : ""}`}
  >
    {/* Vendor Name + Image */}
    <td className="px-6 py-3 min-w-[200px] hover:scale-105 transition duration-150">
      <NavLink to={`/admin/vendor/profile/${v._id}`} className="flex items-center gap-4">
        <img
          src={v.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${v.name || "V"}`}
          alt={`${v.name || "Vendor"} profile`}
          title={v.name || "Vendor Name not available"}
          className="w-10 h-10 rounded-full object-cover shadow-md shadow-purple-400"
        />
        <span
          className="font-medium text-gray-800 truncate max-w-[160px] group-hover:font-semibold"
          title={v.name || "Vendor Name not available"}
        >
          {v.name || "N/A"}
        </span>
      </NavLink>
    </td>

    {/* Email */}
    <td className="px-6 py-3 min-w-[220px] hover:scale-105 hover:underline transition duration-150">
      {v.email ? (
        <a href={`mailto:${v.email}`} target="_blank" title={`Mail to ${(v.name || "Vendor").split(" ")[0]}`}>
          {v.email}
        </a>
      ) : (
        <span title="Email not available">N/A</span>
      )}
    </td>

    {/* Shop Name */}
    <td
      className="px-6 py-3 min-w-[160px] hover:scale-105 transition duration-150"
      title={v.shopName || "Shop name not available"}
    >
      {v.shopName || "N/A"}
    </td>

    {/* Product Quantity */}
    <td
      className="px-6 py-3 min-w-[100px] hover:scale-105 transition duration-150"
      title={`${v.productQuantity ?? "Unknown"} products`}
    >
      {v.productQuantity ?? "N/A"}
    </td>

    {/* Total Sales */}
    <td
      className="px-6 py-3 min-w-[140px] font-bold hover:scale-105 transition duration-150"
      title={`₹${(v.totalSales ?? 0).toLocaleString()}`}
    >
      ₹{(v.totalSales ?? 0).toLocaleString()}
    </td>

    {/* Commission */}
    <td
      className="px-6 py-3 min-w-[140px] text-left font-bold hover:scale-105 transition duration-150"
      title={`₹${(v.commissionRate ?? 0).toLocaleString()}`}
    >
      ₹{(v.commissionRate ?? 0).toLocaleString()}
    </td>

    {/* Registered At */}
    <td
      className="px-6 py-3 min-w-[150px] hover:scale-105 transition duration-150"
      title={v.registeredAt ? getFormatDate(v.registeredAt) : "Date not available"}
    >
      {v.registeredAt ? getFormatDate(v.registeredAt) : "N/A"}
    </td>

    {/* Status */}
    <td className="px-6 py-3 min-w-[140px]">
      <span
        title={v.status || "Status unknown"}
        className={`inline-flex items-center px-3 py-1 rounded-full hover:scale-105 transition duration-150 text-xs font-semibold
        ${v.status === "active"
          ? "bg-green-100 text-green-700"
          : v.status === "suspended"
            ? "bg-red-100 text-red-700"
            : v.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : v.status === "inactive"
                ? "bg-gray-200 text-gray-700"
                : "bg-blue-100 text-blue-700"
        }`}
      >
        {v.status || "Unknown"}
      </span>
    </td>

    {/* Actions */}
    <td className="px-6 py-3 min-w-[160px] hover:scale-105 transition duration-150">
      <div className="flex items-center gap-3">
        <NavLink
          to={`/admin/vendor/profile/${v._id}`}
          title="View Vendor"
          className="hover:text-blue-600 hover:scale-110 transition duration-150"
        >
          <FiEye size={20} />
        </NavLink>
        <NavLink
          to={`/admin/vendor/edit-delete/${v._id}`}
          title="Edit Vendor"
          className="hover:text-blue-600 hover:scale-110 transition duration-150"
        >
          <FiEdit size={20} />
        </NavLink>
        <NavLink
          to={`/admin/vendor/edit-delete/${v._id}`}
          title="Delete Vendor"
          className="hover:text-red-600 hover:scale-110 transition duration-150"
        >
          <FiTrash2 size={20} />
        </NavLink>
      </div>
    </td>
  </tr>
);
