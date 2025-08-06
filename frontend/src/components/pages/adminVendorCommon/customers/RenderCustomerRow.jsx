// RenderCustomerRow.jsx
import { formatAddress } from "../../../../utils/formatAddress";
import { getFormatDate } from "../../../../utils/formatDate";

export const RenderCustomerRow = (user, i) => {
  return (
    <tr
      key={user._id || i}
      className={`hover:bg-blue-50 transition ${i !== 0 ? "border-t border-gray-200" : ""}`}
    >
      {/* Customer (name with avatar) */}
      <td className="px-6 py-4 min-w-[200px] hover:scale-105 transition duration-150">
        <div className="flex items-center gap-4">
          <img
            src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || "U"}`}
            alt={user.name || "Unknown Customer"}
            title={`${user.name || "Unknown User"}'s avatar`}
            className="w-10 h-10 rounded-full object-cover shadow-md shadow-purple-400"
          />
          <span
            className="font-semibold text-gray-800 truncate max-w-[160px]"
            title={user.name || "No Name"}
          >
            {user.name || "N/A"}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 min-w-[220px] hover:scale-105 hover:underline transition duration-150">
        <a href={`mailto:${user.email}`} title={`Send email to ${user.name?.split(" ")[0] || "User"}`}>
          {user.email || "N/A"}
        </a>
      </td>

      {/* Email */}
      <td className="px-6 py-4 min-w-[220px] hover:scale-105 hover:underline transition duration-150">
        <a href={`mailto:${user.phone}`} title={`Send email to ${user.name?.split(" ")[0] || "User"}`}>
          {user.phone || "N/A"}
        </a>
      </td>

      {/* Address  */}
      <td className="px-6 py-4 min-w-[250px] hover:scale-105 transition duration-150">
        {user.address ? formatAddress(user.address) : "Not Provided"}
      </td>

      {/* Total Orders */}
      <td className="px-6 py-4 min-w-[120px] font-medium hover:scale-105 transition duration-150">
        {user.totalOrders ?? 0}
      </td>

      {/* Total Value */}
      <td className="px-6 py-4 min-w-[140px] font-bold hover:scale-105 transition duration-150">
        ₹{(user.totalOrderValue ?? 0).toLocaleString()}
      </td>

      {/* Registered On */}
      <td className="px-6 py-4 min-w-[180px] hover:scale-105 transition duration-150">
        {user.createdAt ? getFormatDate(user.createdAt) : "Unknown"}
      </td>
    </tr>
  );
};
