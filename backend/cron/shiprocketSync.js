import cron from "node-cron";
import { ShiprocketClient } from "../services/shiprocket/client.js";
import Order from "../models/Order.js";
import { getHighLevelStatus } from "../utils/shippingStatusMap.js";

cron.schedule("0 */6 * * *", async () => {
  console.log("🔄 Syncing Shiprocket shipments...");

  try {
    // Fetch only orders that have at least one Shiprocket shipment
    const orders = await Order.find({ "orderItems.shiprocketShipmentId": { $exists: true } });

    for (const order of orders) {
      let orderUpdated = false;

      for (const item of order.orderItems) {
        if (!item.shiprocketShipmentId) continue;

        try {
          const tracking = await ShiprocketClient.trackShipment(item.shiprocketShipmentId);

          if (!tracking || !tracking.tracking_data) {
            console.warn(`⚠️ No tracking data for shipment ${item.shiprocketShipmentId}`);
            continue;
          }

          // Update item tracking info
          item.trackingData = tracking;
          const rawStatus = tracking.tracking_data.shipment_status;
          if (rawStatus) {
            item.originalShiprocketStatus = rawStatus;
            item.shiprocketStatus = getHighLevelStatus(rawStatus) || item.shiprocketStatus;
          }

          orderUpdated = true;
        } catch (err) {
          console.error(`❌ Failed to update shipment ${item.shiprocketShipmentId}:`, err.message);
          // Continue to next item
        }
      }

      // Save order only if at least one item was updated
      if (orderUpdated) {
        try {
          await order.save();
          console.log(`✅ Updated order ${order._id}`);
        } catch (err) {
          console.error(`❌ Failed to save order ${order._id}:`, err.message);
        }
      }
    }

    console.log("✅ Shipments synced with Shiprocket");
  } catch (err) {
    console.error("❌ Cron job failed:", err.message);
  }
});