// services/shiprocket/returnOrder.js
import { ShiprocketClient } from "./client.js";
import { buildShiprocketPayload } from "./payloadBuilder.js";

export async function returnOrderToShiprocket(orderId, vendorId = null) {
  // Build payload for return
  const payloads = await buildShiprocketPayload(orderId, { mode: "return", vendorFilter: vendorId });

  const results = [];

  for (const { vendorId, order, items, payload } of payloads) {
    try {
      console.log("Return Payload for vendor:", vendorId, payload);
      const response = await ShiprocketClient.createReturnOrder(payload); // use Shiprocket return API
      console.log("Shiprocket Return Response for vendor:", vendorId, response);

      // Update item-level return status in DB
      items.forEach(item => {
        item.shiprocketReturnStatus = response.status || "Return Requested";
      });

      await order.save();
      results.push({ vendorId, success: true, response });
    } catch (err) {
      console.error("Failed to create Shiprocket return for vendor", vendorId, err.message);
      results.push({ vendorId, success: false, error: err.message });
    }
  }

  return results;
}