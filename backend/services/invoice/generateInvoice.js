import { buildInvoicePayload } from "./buildPayload.js";
import { callInvoiceApi } from "./callInvoiceApi.js";
import { saveInvoice } from "./saveInvoice.js";

function validateInvoicePayload(payload) {
  if (!payload.from || !payload.to) throw new Error("Invoice payload missing 'from' or 'to'");
  if (!payload.items || payload.items.length === 0) throw new Error("Invoice payload has no items");
  for (const item of payload.items) {
    if (!item.name || typeof item.quantity !== "number" || typeof item.unit_cost !== "number") {
      throw new Error("Invoice item missing required fields");
    }
  }
}

export async function generateInvoice(order, vendor, user) {
  const invoiceNumber = order.invoiceNumber || `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${order._id}`;

  // User Invoice
  const userPayload = buildInvoicePayload(order, vendor, user, "customer");
  validateInvoicePayload(userPayload);
  const userBuffer = await callInvoiceApi(userPayload);
  const userInvoiceUrl = await saveInvoice(userBuffer, `${invoiceNumber}-customer`, "customer");

  // Vendor Invoice
  const vendorPayload = buildInvoicePayload(order, vendor, user, "vendor");
  validateInvoicePayload(vendorPayload);
  const vendorBuffer = await callInvoiceApi(vendorPayload);
  const vendorInvoiceUrl = await saveInvoice(vendorBuffer, `${invoiceNumber}-vendor`, "vendor");

  return { userInvoiceUrl, vendorInvoiceUrl };
}