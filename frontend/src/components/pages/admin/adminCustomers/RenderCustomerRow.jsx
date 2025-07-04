// components/admin/customers/renderCustomerRow.jsx
export const RenderCustomerRow = (c, i) => (
  <tr
    key={i}
    className={`hover:bg-blue-50 hover:shadow-sm transition ${i !== 0 ? "border-t border-gray-200" : ""}`}
  >
    <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-4 hover:scale-105 transition duration-150 cursor-pointer group">
      <img
        src={c.avatar}
        alt={`${c.name} profile`}
        className="w-10 h-10 rounded-full object-cover shadow-md shadow-purple-400 scale-105 transition duration-150"
      />
      <span className="group-hover:font-semibold">{c.name}</span>
    </td>
    {[c.email, c.location, c.totalOrders, c.totalValue.toLocaleString(), c.registeredOn].map((info, index) => (
      <td key={index} className="px-4 py-3 hover:scale-105 transition duration-150">
        {info}
      </td>
    ))}
  </tr>
);
