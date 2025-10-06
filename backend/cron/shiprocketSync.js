import cron from "node-cron";
import { ShiprocketClient } from "../services/shiprocket/client.js";
import Order from "../models/Order.js";

cron.schedule("0 */6 * * *", async () => {
  console.log("🔄 Syncing Shiprocket shipments...");
  const orders = await Order.find({ "orderItems.shiprocketShipmentId": { $exists: true } });
  for (const order of orders) {
    for (const item of order.orderItems) {
      if (item.shiprocketShipmentId) {
        const tracking = await ShiprocketClient.trackShipment(item.shiprocketShipmentId);
        item.trackingData = tracking;
        const rawStatus = tracking?.tracking_data?.shipment_status;
        item.originalShiprocketStatus = rawStatus;
        item.shiprocketStatus = getHighLevelStatus(rawStatus) || item.shiprocketStatus;
      }
    }
    await order.save();
  }
  console.log("✅ Shipments synced with Shiprocket");
});