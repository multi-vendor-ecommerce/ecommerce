// services/invoice/invoiceFormatters.js
import { toTitleCase } from "../../utils/titleCase.js";
import { getFormattedAddress } from "../../utils/formatAddress.js";

// Build item description
// Build item description
export const buildItemDescription = (item) => {
  const parts = [];

  if (item?.color) parts.push(`Color: ${toTitleCase(item.color)}`);
  if (item?.size) parts.push(`Size: ${item.size}`);
  if (item?.product?.hsnCode) parts.push(`HSN: ${item.product.hsnCode}`);

  // GST (rate + amount together)
  if (item?.gstRate != null && item?.gstAmount != null) {
    parts.push(`GST: ${item.gstRate}% (₹${item.gstAmount})`);
  } else if (item?.gstRate != null) {
    parts.push(`GST: ${item.gstRate}%`);
  } else if (item?.gstAmount != null) {
    parts.push(`GST: ₹${item.gstAmount}`);
  }

  // Discount (percent + amount together)
  if (item?.discountPercent > 0 && item?.discountAmount > 0) {
    parts.push(`Discount: ${item.discountPercent}% (₹${item.discountAmount})`);
  } else if (item?.discountPercent > 0) {
    parts.push(`Discount: ${item.discountPercent}%`);
  } else if (item?.discountAmount > 0) {
    parts.push(`Discount: ₹${item.discountAmount}`);
  }

  return parts.join(", ");
};

// Format vendor address
export const formatVendorAddress = (vendor) => {
  if (!vendor) return "Vendor";
  const addr = vendor.address || {};

  return [
    toTitleCase(vendor.shopName) || "Vendor",
    `Owner: ${toTitleCase(vendor.name) || "N/A"}`,
    getFormattedAddress(addr),
    `GSTIN: ${vendor.gstNumber || "N/A"}`,
    `Phone: ${vendor.phone || "N/A"}`
  ].filter(Boolean).join("\n");
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