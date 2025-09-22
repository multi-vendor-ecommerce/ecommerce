// RenderInvoiceRow.jsx
import { NavLink } from "react-router-dom";
import { getFormatDate } from "../../../../utils/formatDate";
import { formatNumber } from "../../../../utils/formatNumber";

export const RenderInvoiceRow = (invoice, index, role = "admin") => {
  return (
    <tr
      key={invoice._id || index}
      className={`hover:bg-blue-50 transition ${index !== 0 ? "border-t border-gray-200" : ""}`}
    >
      {/* Invoice Number */}
      <td className="px-6 py-4 min-w-[140px] text-gray-800 truncate">
        {invoice.invoiceNumber || "N/A"}
      </td>

      {/* Total Tax */}
      <td className="px-6 py-4 min-w-[140px]">₹{formatNumber(invoice.totalTax ?? 0)}</td>

      {/* Total Discount */}
      <td className="px-6 py-4 min-w-[140px]">₹{formatNumber(invoice.totalDiscount ?? 0)}</td>

      {/* Grand Total */}
      <td className="px-6 py-4 min-w-[140px] font-bold">₹{formatNumber(invoice.grandTotal ?? 0)}</td>

      {/* Payment Method */}
      <td className="px-6 py-4 min-w-[140px]">{invoice.paymentMethod || "N/A"}</td>

      {/* User Invoice PDF */}
      {role === "admin" && (
        <td className="px-6 py-4 min-w-[140px]">
          {invoice.userInvoiceUrl ? (
            <a
              href={invoice.userInvoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              View
            </a>
          ) : (
            "N/A"
          )}
        </td>
      )}

      {/* Vendor Invoices */}
      {role === "vendor" && (
        <td className="px-6 py-4 min-w-[180px]">
          {invoice.vendorInvoices?.[0]?.invoiceUrl ? (
            <a
              href={invoice.vendorInvoices[0].invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline cursor-pointer truncate"
            >
              View
            </a>
          ) : (
            "N/A"
          )}
        </td>
      )}

      {/* Admin - View All Vendor Invoices */}
      {role === "admin" && (
        <td className="px-6 py-4 min-w-[140px]">
          <NavLink
            to={`/admin/${invoice?._id}/vendor-invoices`}
            className="text-green-600 hover:underline cursor-pointer"
          >
            View All
          </NavLink>
        </td>
      )}

      {/* Created Date */}
      <td className="px-6 py-4 min-w-[180px]">{getFormatDate(invoice.createdAt)}</td>
    </tr>
  );
};