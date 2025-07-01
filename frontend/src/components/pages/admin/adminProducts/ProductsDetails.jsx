import { NavLink } from "react-router-dom";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import classNames from "classnames";

const ProductsData = ({ currentItems }) => {
  return (
    <table className="w-full text-left text-gray-600">
      <thead className="bg-gray-50 text-sm text-gray-500 uppercase">
        <tr>
          {["Product", "ID", "Category", "Units Sold", "Revenue", "Sales Progress", "Actions"].map((label, index) => (
            <th key={index} className={`px-4 py-3 ${label === "Actions" ? "text-right" : ""}`}>{label}</th>
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
              <tr key={i} className="hover:bg-blue-50 transition border-t border-gray-200">
                <td className="px-4 py-4 flex items-center gap-4 hover:scale-105 transition duration-150">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover shadow"
                  />
                  <span className="font-semibold text-gray-800" title="Product Name">{p.name}</span>
                </td>
                <td className="px-4 py-4 text-blue-600 font-medium hover:underline hover:scale-105 transition duration-150" title="Product Number">
                  <NavLink to={`product-details/${p.id}`}>#{p.id}</NavLink>
                </td>
                <td className="px-4 py-4 hover:scale-105 transition duration-150" title="Product Category">{p.category}</td>
                <td className="px-4 py-4 font-medium hover:scale-105 transition duration-150" title="Product Sales">{p.sales}</td>
                <td className="px-4 py-4 font-bold text-gray-900 hover:scale-105 transition duration-150" title="Product Revenue">
                  ₹{Number(p.revenue).toLocaleString()}
                </td>
                <td className="px-4 py-4 w-64 hover:scale-105 transition duration-150">
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
                <td className="px-4 py-4 hover:scale-105 transition duration-150">
                  <div className="flex items-center justify-end gap-4">
                    <NavLink to={`product-details/${p.id}`} title="View Product" className="hover:text-blue-600 hover:scale-110 transition duration-150">
                      <FiEye size={20} />
                    </NavLink>
                    <NavLink to={`edit-delete/${p.id}`} title="Edit Product" className="hover:text-blue-600 hover:scale-110 transition duration-150">
                      <FiEdit size={20} />
                    </NavLink>
                    <NavLink to={`edit-delete/${p.id}`} title="Delete Product" className="hover:text-red-600 hover:scale-110 transition duration-150">
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
  )
}

export default ProductsData;