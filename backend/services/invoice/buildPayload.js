// services/invoice/buildInvoicePayload.js
import {
  buildItemDescription,
  formatVendorAddress,
  formatCustomerAddress,
  formatShipTo,
} from "./invoiceFormatters.js";

export function buildInvoicePayload(order, vendor, user, mode = "customer") {
  if (!order?.orderItems?.length) {
    throw new Error("Order has no items to generate invoice");
  }

  // Build line items
  const items = order.orderItems.map(item => ({
    name: item.product?.title || "Product",
    quantity: Number(item.quantity) || 1,
    unit_cost: Number(item.product?.price) || 0,
    description: buildItemDescription(item),
  }));

  // Notes
  const invoiceNotes = [
    mode === "customer"
      ? "Thank you for your purchase!"
      : "Internal copy for vendor records.",
    order.customNotes || null,
  ].filter(Boolean).join("\n");

  const invoiceTerms = [
    mode === "vendor"
      ? "Please process this order promptly and update the status in your vendor dashboard."
      : order.paymentMethod === "COD"
        ? "Cash on Delivery. Please pay at the time of delivery."
        : "Payment received via Razorpay. Returns accepted within 15 days.",  
    order.termsAndConditions || null,
  ].filter(Boolean).join("\n");

  // Logos
  const logo =
    "https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_1280.png";

  // Final payload
  return {
    logo,
    currency: "INR",

    // ✅ Invoice info
    number: order.invoiceNumber || order._id || "INV-000",
    date: new Date().toISOString().slice(0, 10), // Invoice date = today

    from: formatVendorAddress(vendor),
    to: formatCustomerAddress(order, user),
    ship_to: formatShipTo(order, user),

    items,
    fields: { tax: "%", discounts: true, shipping: true },
    discounts: order.discounts || 0,
    tax: order.tax || 0,
    shipping: order.shippingCharges || 0,
    amount_paid: order.paymentMethod === "Online" ? order.totalAmount : 0,

    // ✅ Order info (separate from invoice date)
    custom_fields: [
      { name: "Order ID", value: order._id.toString() },
      {
        name: "Order Date",
        value: order.createdAt
          ? new Date(order.createdAt).toISOString().slice(0, 10)
          : "N/A",
      },
      { name: "Payment Method", value: order.paymentMethod },
      ...(order.paymentMethod === "Online"
        ? [{ name: "Payment ID", value: order.paymentInfo?.id || "N/A" }]
        : []),
      { name: "Platform", value: "NoahPlanet Pvt Ltd" },
      ...(vendor?.gstNumber
        ? [{ name: "Vendor GSTIN", value: vendor.gstNumber }]
        : []),
    ],

    notes: invoiceNotes,
    terms: invoiceTerms,
  };
}