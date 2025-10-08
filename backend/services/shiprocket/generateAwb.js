// services/shiprocket/assignAWB.js
import { ShiprocketClient } from "./client.js";
import { getHighLevelStatus } from "../../utils/shippingStatusMap.js";
import Order from "../../models/Order.js";
import { generateShippingDocs } from "./generateDocs.js";

export async function assignAWBToOrder(orderId) {
  const order = await Order.findById(orderId).populate("orderItems.product");
  if (!order) throw new Error("Order not found");

  // Only include items that have shipmentId but no AWB
  const itemsToAssign = order.orderItems.filter(
    item => item.shiprocketShipmentId && !item.shiprocketAWB
  );

  if (!itemsToAssign.length) {
    console.log("No items eligible for AWB assignment.");
    return order;
  }

  const shipmentIds = itemsToAssign.map(i => i.shiprocketShipmentId).filter(Boolean);

  try {
    // Assign AWB using Shiprocket API
    const awbResponse = await ShiprocketClient.assignAWB(shipmentIds);
    console.log("AWB Assignment Response:", awbResponse);

    if (!awbResponse.awb_code) {
      throw new Error("AWB assignment failed: No AWB code returned");
    }

    // Update each item with AWB
    itemsToAssign.forEach(item => {
      item.shiprocketAWB = awbResponse.awb_code || ""; // if multiple, handle accordingly
    });

    await order.save();

    // Optional: generate labels/invoice/manifest after AWB
    const updatedOrder = await generateShippingDocs(orderId);

    return updatedOrder;
  } catch (err) {
    console.error("Failed to assign AWB:", err.message);
    throw err;
  }
}