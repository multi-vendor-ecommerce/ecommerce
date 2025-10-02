// services/invoice/buildInvoicePayload.js
import {
  buildItemDescription,
  formatCustomerAddress,
  formatShipTo,
} from "./invoiceFormatters.js";

export function buildInvoicePayload(order, user) {
  if (!order?.orderItems?.length) {
    throw new Error("Order has no items to generate invoice");
  }

  // Build line items based on Order model
  const items = order.orderItems.map((item) => ({
    name: item.product?.title || "Product",
    quantity: Number(item.quantity) || 1,
    unit_cost: Number(item.originalPrice) || 0,
    description: buildItemDescription(item),
  }));

  const invoiceNotes = [
    "Thank you for your purchase!",
    order.customNotes || null,
  ]
    .filter(Boolean)
    .join("\n");

  const invoiceTerms = [
    order.paymentMethod === "COD"
      ? "Cash on Delivery. Please pay at the time of delivery."
      : "Payment received via Razorpay. Returns accepted within 15 days.",
    order.termsAndConditions || null,
  ]
    .filter(Boolean)
    .join("\n");

  const logo =
    "https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_1280.png";

  return {
    logo,
    currency: "INR",
    number: order.invoiceNumber || order._id || "INV-000",
    date: new Date().toISOString().slice(0, 10),
    from: "NoahPlanet Pvt Ltd\nGSTIN: N/A\nEmail: support@noahplanet.com\nPhone: 9999999999",
    to: formatCustomerAddress(order, user),
    ship_to: formatShipTo(order, user),
    items,
    fields: { tax: "%", discounts: true, shipping: true },
    discounts: order.totalDiscount || 0,
    tax: order.totalTax || 0,
    gstAmount: order.gstAmount || undefined,
    shipping: order.shippingCharges || 0,
    amount_paid: order.paymentMethod === "Online" ? order.grandTotal : 0,
    header: "INVOICE",
    item_header: "Product",
    quantity_header: "Qty",
    unit_cost_header: "Unit Price",
    amount_header: "Total Amount",
    subtotal_title: "Sub Total",
    discounts_title: "Total Discount",
    tax_title: "GST / Tax",
    shipping_title: "Delivery Charges",
    total_title: "Grand Total",
    amount_paid_title: "Amount Paid",
    balance_title: "Balance Due",
    notes_title: "Additional Notes",
    terms_title: "Terms & Conditions",
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
    ],
    notes: invoiceNotes,
    terms: invoiceTerms,
  };
}