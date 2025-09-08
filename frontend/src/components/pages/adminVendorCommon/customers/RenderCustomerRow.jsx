// RenderCustomerRow.jsx
import { formatAddress, shortFormatAddress } from "../../../../utils/formatAddress";
import { getFormatDate } from "../../../../utils/formatDate";
import { toTitleCase } from "../../../../utils/titleCase";
import { formatNumber } from "../../../../utils/formatNumber";

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
            src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${toTitleCase(user.name) || "U"}`}
            alt={toTitleCase(user.name) || "Unknown Customer"}
            title={`${toTitleCase(user.name) || "Unknown User"}'s avatar`}
            className="w-10 h-10 rounded-full object-cover shadow-md shadow-purple-400"
          />
          <span
            className="font-semibold text-gray-800 truncate max-w-[160px]"
            title={toTitleCase(user.name) || "No Name"}
          >
            {toTitleCase(user.name) || "N/A"}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 min-w-[220px] hover:scale-105 hover:underline transition duration-150">
        <a href={`mailto:${user.email}`} title={`Send email to ${toTitleCase(user.name?.split(" ")[0]) || "User"}`}>
          {user.email || "N/A"}
        </a>
      </td>

      {/* Phone */}
      <td className="px-6 py-4 min-w-[160px] hover:scale-105 hover:underline transition duration-150">
        {user.phone || "N/A"}
      </td>

      {/* Laptop Address  */}
      <td className="px-6 py-4 min-w-[350px] mr-4 hover:scale-105 transition duration-150 hidden lg:block">
        {user.address ? formatAddress(user.address) : "Not Provided"}
      </td>

      {/* Mobile-Tab Address  */}
      <td className="px-6 py-4 min-w-[250px] hover:scale-105 transition duration-150 lg:hidden">
        {user.address ? shortFormatAddress(user.address) : "Not Provided"}
      </td>

      {/* Total Orders */}
      <td className="px-6 py-4 min-w-[120px] font-medium hover:scale-105 transition duration-150">
        {formatNumber(user.totalOrders ?? 0)}
      </td>

      {/* Total Value */}
      <td className="px-6 py-4 min-w-[140px] font-bold hover:scale-105 transition duration-150">
        ₹{formatNumber(user.totalOrderValue ?? 0)}
      </td>

      {/* Registered On */}
      <td className="px-6 py-4 min-w-[180px] hover:scale-105 transition duration-150">
        {user.createdAt ? getFormatDate(user.createdAt) : "Unknown"}
      </td>
    </tr>
  );
};