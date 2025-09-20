// RenderInvoiceRow.jsx
import { getFormatDate } from "../../../../utils/formatDate";
import { formatNumber } from "../../../../utils/formatNumber";

export const RenderInvoiceRow = (invoice, index, role = "admin") => {
  const vendor = invoice.vendorInvoices?.[0]?.vendorId || {};
  return (
    <tr
      key={invoice._id || index}
      className={`hover:bg-blue-50 transition ${index !== 0 ? "binvoice-t binvoice-gray-200" : ""}`}
    >
      {/* Invoice Number */}
      <td className="px-6 py-4 min-w-[140px] text-gray-800 truncate">{invoice.invoiceNumber || "N/A"}</td>

      {/* Total Tax */}
      <td className="px-6 py-4 min-w-[140px]">₹{formatNumber(invoice.totalTax ?? 0)}</td>

      {/* Total Discount */}
      <td className="px-6 py-4 min-w-[140px]">₹{formatNumber(invoice.totalDiscount ?? 0)}</td>

      {/* Grand Total */}
      <td className="px-6 py-4 min-w-[140px] font-bold">₹{formatNumber(invoice.grandTotal ?? 0)}</td>

      {/* Payment Method */}
      <td className="px-6 py-4 min-w-[140px]">{invoice.paymentMethod || "N/A"}</td>

      {/* Invoice PDF Links */}
      <td className="px-6 py-4 min-w-[140px]">
        {role === "admin" && invoice.userInvoiceUrl && (
          <a
            href={invoice.userInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View
          </a>
        )}
      </td>

      <td className="px-6 py-4 min-w-[140px]">
        {invoice.vendorInvoices?.map((vi, idx) =>
          vi.invoiceUrl ? (
            <a
              key={vi.invoiceUrl}
              href={vi.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline ml-2"
            >
              V {invoice.vendorInvoices.length > 1 ? idx + 1 : ""}
            </a>
          ) : null
        )}
      </td>
      <td className="px-6 py-4 min-w-[180px]">{getFormatDate(invoice.createdAt)}</td>
    </tr>
  );
};