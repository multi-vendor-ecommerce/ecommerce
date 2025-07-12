// components/admin/products/renderProductRow.jsx
import { NavLink } from "react-router-dom";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import classNames from "classnames";

export const RenderProductRow = (p, i, maxUnitsSold) => {
  const isHighSales = p.unitsSold >= 500;

  return (
    <tr
      key={p._id}
      className={`hover:bg-blue-50 transition ${i !== 0 ? "border-t border-gray-200" : ""}`}
    >
      {/* Product (image + name) */}
      <td className="px-6 py-4 min-w-[200px] hover:scale-105 transition duration-150">
        <NavLink to={`/admin/product-details/${p._id}`} className="flex items-center gap-4">
          <img
            src={p.images[0]}
            alt={p.title}
            className="w-12 h-12 rounded-lg object-cover shadow-md shadow-purple-400"
          />
          <span className="font-semibold text-gray-800 max-w-[160px] truncate" title={p.title}>
            {p.title}
          </span>
        </NavLink>
      </td>

      {/* ID */}
      <td className="px-6 py-4 min-w-[140px] text-blue-600 font-medium hover:underline hover:scale-105 transition duration-150">
        <NavLink to={`/admin/product-details/${p._id}`}>#{p._id}</NavLink>
      </td>

      {/* Category */}
      <td className="px-6 py-4 min-w-[160px] hover:scale-105 transition duration-150">
        {p.category !== null ? p.category.name : "Uncategorized"}
      </td>

      {/* Price */}
      <td className="px-6 py-4 min-w-[120px] font-medium hover:scale-105 transition duration-150">
        ₹{p.price > 0 ? (p.price).toLocaleString() : 0}
      </td>

      {/* Units sold */}
      <td className="px-6 py-4 min-w-[120px] font-medium hover:scale-105 transition duration-150">
        {p.unitsSold}
      </td>

      {/* Revenue */}
      <td className="px-6 py-4 min-w-[140px] font-bold hover:scale-105 transition duration-150">
        ₹{(p.totalRevenue).toLocaleString()}
      </td>

      {/* Sales progress bar */}
      <td className="px-6 py-4 min-w-[220px] hover:scale-105 transition duration-150 relative">
        <p
          className={classNames("text-sm mb-1 font-semibold", {
            "text-green-600": isHighSales,
            "text-red-500": !isHighSales,
          })}
        >
          {p.unitsSold.toLocaleString()} Sales
        </p>
        <div className="w-[80%] h-2 bg-gray-200 rounded-full overflow-h_idden absolute bottom-5">
          <div
            className={classNames("h-full rounded-full", {
              "bg-green-500": isHighSales,
              "bg-red-400": !isHighSales,
            })}
            style={{ width: `${Math.min((p.unitsSold / maxUnitsSold) * 100, 100)}%` }}
          ></div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 min-w-[120px] hover:scale-105 transition duration-150">
        <div className="flex items-center gap-3">
          <NavLink
            to={`/admin/product-details/${p._id}`}
            title="View Product"
            className="hover:text-blue-600 hover:scale-110 transition duration-150"
          >
            <FiEye size={20} />
          </NavLink>

          <NavLink
            to={`/admin/product/edit-delete/${p._id}`}
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
