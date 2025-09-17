export function buildInvoicePayload(order, vendor, user, mode = "customer") {
  if (!order?.orderItems || !order.orderItems?.length) {
    throw new Error("Order has no items to generate invoice");
  }

  // Helper to build item description
  const buildItemDescription = (item) => {
    const parts = [];
    if (item.color) parts.push(`Color: ${item.color}`);
    if (item.size) parts.push(`Size: ${item.size}`);
    if (item.product?.hsnCode) parts.push(`HSN: ${item.product.hsnCode}`);
    if (item.product?.gstRate) parts.push(`GST: ${item.product.gstRate}%`);
    return parts.join(", ");
  };

  // Build invoice items
  const items = order.orderItems.map(item => ({
    name: item.product?.title || "Product",
    quantity: Number(item.quantity) || 1,
    unit_cost: Number(item.product?.price) || 0,
    description: buildItemDescription(item),
  }));

  // Build invoice-level notes
  const invoiceNotes = [
    mode === "customer" ? "Thank you for your purchase!" : "Internal copy for vendor records.",
    order.tax ? `Tax: ${order.tax}` : null,
    order.shippingCharges ? `Shipping: ${order.shippingCharges}` : null,
    order.customNotes ? order.customNotes : null,
  ].filter(Boolean).join("\n");

  const base = {
    logo: vendor?.shopLogo || "https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_1280.png",
    currency: "INR",
    number: order.invoiceNumber || order._id || "INV-000",
    date: order.createdAt ? new Date(order.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    notes: invoiceNotes,
    terms: "Payment due within 15 days",
    items,
  };

  return {
    ...base,
    from: vendor?.shopName || "Vendor",
    to: order.shippingInfo?.recipientName || user?.name || "Customer",
  };
}