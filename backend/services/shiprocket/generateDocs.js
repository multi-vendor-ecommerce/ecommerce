// services/shiprocket/generateDocs.js
import Order from "../../models/Order.js";
import { ShiprocketClient } from "./client.js";

export async function generateShippingDocs(orderId) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  const shipmentIds = order.items
    .map(i => i.shiprocketShipmentId)
    .filter(Boolean);
  const orderIds = order.items
    .map(i => i.shiprocketOrderId)
    .filter(Boolean);

  if (!shipmentIds.length || !orderIds.length) {
    throw new Error("No shipment or order IDs available for document generation");
  }

  // Call Shiprocket API to generate documents
  const docsResponse = await ShiprocketClient.generateDocuments(shipmentIds, orderIds);

  // Save URLs to each item
  order.items.forEach(item => {
    item.labelUrl = docsResponse.labelUrl || "";
    item.invoiceUrl = docsResponse.invoiceUrl || "";
    item.manifestUrl = docsResponse.manifestUrl || "";
  });

  await order.save();
  return order;
}