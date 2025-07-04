import { NavLink } from "react-router-dom";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import classNames from "classnames";

const ProductsDetails = ({ currentItems }) => {
  return (
    <table className="w-screen table-auto text-left text-gray-600">
      <thead className="bg-gray-50 text-sm text-gray-500 uppercase">
        <tr>
          {[
            "Product",
            "ID",
            "Category",
            "Units Sold",
            "Revenue",
            "Sales Progress",
            "Actions",
          ].map((label, index) => (
            <th key={index} className="px-6 py-3 min-w-[160px]">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white">
        {currentItems.length === 0 ? (
          <tr>
            <td colSpan={7} className="py-10 text-center text-gray-500">
              No products available.
            </td>
          </tr>
        ) : (
          currentItems.map((p, i) => {
            const isHighSales = p.sales >= 500;
            return (
              <tr
                key={i}
                className="hover:bg-blue-50 transition border-t border-gray-200"
              >
                {/* Product with image */}
                <td className="px-6 py-4 min-w-[200px] flex items-center gap-4 hover:scale-105 transition duration-150">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover shadow-md shadow-purple-400"
                  />
                  <span
                    className="font-semibold text-gray-800 max-w-[160px] truncate"
                    title={p.name}
                  >
                    {p.name}
                  </span>
                </td>

                {/* ID */}
                <td className="px-6 py-4 min-w-[140px] text-blue-600 font-medium hover:underline hover:scale-105 transition duration-150">
                  <NavLink to={`/admin/product-details/${p.id}`}>#{p.id}</NavLink>
                </td>

                {/* Category */}
                <td className="px-6 py-4 min-w-[160px] hover:scale-105 transition duration-150">
                  {p.category}
                </td>

                {/* Units Sold */}
                <td className="px-6 py-4 min-w-[120px] font-medium hover:scale-105 transition duration-150">
                  {p.sales}
                </td>

                {/* Revenue */}
                <td className="px-6 py-4 min-w-[140px] font-bold text-gray-900 hover:scale-105 transition duration-150">
                  ₹{Number(p.revenue).toLocaleString()}
                </td>

                {/* Sales Progress */}
                <td className="px-6 py-4 min-w-[220px] hover:scale-105 transition duration-150">
                  <p
                    className={classNames("text-sm mb-1 font-semibold", {
                      "text-green-600": isHighSales,
                      "text-red-500": !isHighSales,
                    })}
                  >
                    {p.sales.toLocaleString()} Sales
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={classNames("h-full rounded-full", {
                        "bg-green-500": isHighSales,
                        "bg-red-400": !isHighSales,
                      })}
                      style={{
                        width: `${Math.min((p.sales / 1200) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 min-w-[100px] hover:scale-105 transition duration-150">
                  <div className="flex items-center gap-3">
                    <NavLink
                      to={`/admin/product-details/${p.id}`}
                      title="View Product"
                      className="hover:text-blue-600 hover:scale-110 transition duration-150"
                    >
                      <FiEye size={20} />
                    </NavLink>
                    <NavLink
                      to={`/admin/product/edit-delete/${p.id}`}
                      title="Edit Product"
                      className="hover:text-blue-600 hover:scale-110 transition duration-150"
                    >
                      <FiEdit size={20} />
                    </NavLink>
                    <NavLink
                      to={`/admin/product/edit-delete/${p.id}`}
                      title="Delete Product"
                      className="hover:text-red-600 hover:scale-110 transition duration-150"
                    >
                      <FiTrash2 size={20} />
                    </NavLink>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default ProductsDetails;
