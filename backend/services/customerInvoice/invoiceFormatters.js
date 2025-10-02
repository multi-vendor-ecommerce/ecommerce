// services/invoice/invoiceFormatters.js
import { toTitleCase } from "../../utils/titleCase.js";
import { getFormattedAddress } from "../../utils/formatAddress.js";

// Build item description
export const buildItemDescription = (item) => {
  const parts = [];

  if (item?.color) parts.push(`Color: ${toTitleCase(item.color)}`);
  if (item?.size) parts.push(`Size: ${item.size}`);
  if (item?.product?.hsnCode) parts.push(`HSN: ${item.product.hsnCode}`);

  if (item?.gstRate != null && item?.gstAmount != null) {
    parts.push(`GST: ${item.gstRate}% (₹${item.gstAmount})`);
  } else if (item?.gstRate != null) {
    parts.push(`GST: ${item.gstRate}%`);
  } else if (item?.gstAmount != null) {
    parts.push(`GST: ₹${item.gstAmount}`);
  }

  if (item?.discountPercent > 0 && item?.discountAmount > 0) {
    parts.push(`Discount: ${item.discountPercent}% (₹${item.discountAmount})`);
  } else if (item?.discountPercent > 0) {
    parts.push(`Discount: ${item.discountPercent}%`);
  } else if (item?.discountAmount > 0) {
    parts.push(`Discount: ₹${item.discountAmount}`);
  }

  return parts.join(", ");
};

// Format customer billing address
export const formatCustomerAddress = (order, user) => {
  const ship = user?.address;
  if (!ship) return toTitleCase(user?.name) || "Customer";

  return [
    toTitleCase(user?.name) || "Customer",
    getFormattedAddress(ship),
    `Phone: ${user?.phone || ""}`
  ].filter(Boolean).join("\n");
};

// Format shipping address (ship_to)
export const formatShipTo = (order, user) => {
  const ship = order.shippingInfo || user?.address;
  if (!ship) return "";

  return [
    toTitleCase(ship.recipientName) || toTitleCase(user?.name) || "Customer",
    getFormattedAddress(ship),
    `Phone: ${ship.recipientPhone || user?.phone || ""}`
  ].filter(Boolean).join("\n");
};