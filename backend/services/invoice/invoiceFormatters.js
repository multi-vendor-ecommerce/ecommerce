// services/invoice/invoiceFormatters.js

// Build item description
export const buildItemDescription = (item) => {
  const parts = [];
  if (item.color) parts.push(`Color: ${item.color}`);
  if (item.size) parts.push(`Size: ${item.size}`);
  if (item.product?.hsnCode) parts.push(`HSN: ${item.product.hsnCode}`);
  if (item.product?.gstRate) parts.push(`GST: ${item.product.gstRate}%`);
  return parts.join(", ");
};

// Format vendor address
export const formatVendorAddress = (vendor) => {
  if (!vendor?.address) return vendor?.shopName || "Vendor";
  const addr = vendor.address;
  return [
    vendor.shopName || "Vendor",
    `Owner: ${vendor.name || "N/A"}`,
    `${addr.line1 || ""}${addr.line2 ? ", " + addr.line2 : ""}`,
    `${addr.locality ? addr.locality + ", " : ""}${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}`,
    `${addr.country || "India"}`,
    `GSTIN: ${vendor.gstNumber || "N/A"}`,
    `Phone: ${vendor.phone || ""}`
  ].filter(Boolean).join("\n");
};

// Format customer billing address
export const formatCustomerAddress = (order, user) => {
  const ship = order.shippingInfo || user?.address;
  if (!ship) return user?.name || "Customer";
  return [
    ship.recipientName || user?.name || "Customer",
    `${ship.line1 || ""}${ship.line2 ? ", " + ship.line2 : ""}`,
    `${ship.locality ? ship.locality + ", " : ""}${ship.city || ""}, ${ship.state || ""} - ${ship.pincode || ""}`,
    `${ship.country || "India"}`,
    `Phone: ${ship.recipientPhone || user?.phone || ""}`
  ].filter(Boolean).join("\n");
};

// Format shipping address (ship_to)
export const formatShipTo = (order, user) => {
  const ship = order.shippingInfo || user?.address;
  if (!ship) return "";
  return [
    ship.recipientName || user?.name || "Customer",
    `${ship.line1 || ""}${ship.line2 ? ", " + ship.line2 : ""}`,
    `${ship.locality ? ship.locality + ", " : ""}${ship.city || ""}, ${ship.state || ""} - ${ship.pincode || ""}`,
    `${ship.country || "India"}`
  ].filter(Boolean).join("\n");
};