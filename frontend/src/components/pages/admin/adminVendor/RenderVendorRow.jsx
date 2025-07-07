// components/vendor/rows/renderVendorRow.js
import { NavLink } from "react-router-dom";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import { FaCheck, FaTimes } from "react-icons/fa";

export const renderVendorRow = (v, i, toggleStatus) => (
  <tr
    key={v.id}
    className={`hover:bg-blue-50 transition ${i !== 0 && "border-t border-gray-200"}`}
  >
    <td className="px-6 py-3 min-w-[200px] flex items-center gap-4 hover:scale-105 transition duration-150">
      <img
        src={v.avatar}
        alt={`${v.name} profile`}
        className="w-10 h-10 rounded-full object-cover shadow-md shadow-blue-400 scale-105 transition duration-150"
      />
      <span className="font-medium text-gray-800 truncate max-w-[160px] group-hover:font-semibold">
        {v.name}
      </span>
    </td>
    <td className="px-6 py-3 min-w-[220px] hover:scale-105 hover:underline transition duration-150">
      <a href={`mailto:${v.email}`} target="_blank" title={`Mail to ${(v.name).split(" ")[0]}`}>{v.email}</a>
    </td>
    <td className="px-6 py-3 min-w-[160px] hover:scale-105 hover:font-semibold hover:text-blue-500 hover:underline transition duration-150">
      <NavLink to={`/admin/vendor/shop-overview/${v.shopName}`}>{v.shopName}</NavLink>
    </td>
    <td className="px-6 py-3 min-w-[100px] text-center hover:scale-105 transition duration-150">{v.products}</td>
    <td className="px-6 py-3 min-w-[140px] text-center font-bold hover:scale-105 transition duration-150">
      ₹{(v.totalSales).toLocaleString()}
    </td>
    <td className="px-6 py-3 min-w-[140px] text-center font-bold hover:scale-105 transition duration-150">
      ₹{(v.commission).toLocaleString()}
    </td>
    <td className="px-6 py-3 min-w-[150px] hover:scale-105 transition duration-150">{v.date}</td>
    <td className="px-6 py-3 min-w-[140px]">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full hover:scale-105 transition duration-150 text-xs font-semibold ${v.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
          }`}
      >
        {v.status}
      </span>
    </td>
    <td className="px-6 py-3 min-w-[160px] hover:scale-105 transition duration-150">
      <div className="flex items-center gap-3">
        <NavLink
          to={`/admin/vendor/shop-overview/${v.shopName}`}
          title="View Vendor"
          className="hover:text-blue-600 hover:scale-110 transition duration-150"
        >
          <FiEye size={20} />
        </NavLink>
        <NavLink
          to={`/admin/vendor/edit-delete/${v.id}`}
          title="Edit Vendor"
          className="hover:text-blue-600 hover:scale-110 transition duration-150"
        >
          <FiEdit size={20} />
        </NavLink>
        <NavLink
          to={`/admin/vendor/edit-delete/${v.id}`}
          title="Delete Vendor"
          className="hover:text-red-600 hover:scale-110 transition duration-150"
        >
          <FiTrash2 size={20} />
        </NavLink>
        <button
          onClick={() => toggleStatus(v.id)}
          className="hover:text-green-600"
          title="Toggle Status"
        >
          {v.status === "active" ? <FaTimes size={20} /> : <FaCheck size={20} />}
        </button>
      </div>
    </td>
  </tr>
);
