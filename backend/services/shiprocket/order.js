// services/shiprocket/pushOrder.js
import { ShiprocketClient } from "./client.js";
import { buildShiprocketPayload } from "./payloadBuilder.js";
import { getHighLevelStatus } from "../../utils/shippingStatusMap.js"

export async function pushOrderToShiprocket(orderId) {
  const payloads = await buildShiprocketPayload(orderId);

  for (const { vendorId, order, items, payload } of payloads) {
    try {
      // Create order on Shiprocket
      const response = await ShiprocketClient.createOrder(payload);
      if (!response?.shipment_id) {
        console.error("No shipment ID returned for vendor:", vendorId);
        continue;
      }

      // Assign AWB
      const awbResponse = await ShiprocketClient.assignAWB(response.shipment_id);

      // Update items with Shiprocket IDs & AWB
      items.forEach(item => {
        item.shiprocketOrderId = response.order_id || "";
        item.shiprocketShipmentId = response.shipment_id || "";
        item.shiprocketAWB = response.awb_code || "";

        const status = (response.status || "").toLowerCase();
        item.originalShiprocketStatus = status;
        item.shiprocketStatus = getHighLevelStatus(status);
        
        item.shiprocketStatusCode = response.status_code || null;
        item.courierName = response.courier_company || "";
      });

      await order.save();
    } catch (err) {
      console.error("Failed to push order for vendor:", vendorId, err.message);
    }
  }

  return payloads.map(p => p.order);
}