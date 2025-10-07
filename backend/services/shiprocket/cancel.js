import { ShiprocketClient } from "./client.js";

export async function cancelShiprocketOrders(orderItems) {
  const results = [];

  for (const item of orderItems) {
    try {
      if (item.shiprocketOrderId) {
        const res = await ShiprocketClient.cancelOrder(item.shiprocketOrderId);
        item.shiprocketStatus = "Cancelled";
        results.push({ itemId: item._id, success: true, response: res });
      } else {
        // Local cancellation only (not pushed to Shiprocket yet)
        item.shiprocketStatus = "Cancelled";
        results.push({ itemId: item._id, success: true, response: null });
      }
    } catch (err) {
      console.error(`Cancel failed for ${item.shiprocketOrderId}:`, err.message);
      item.shiprocketStatus = "CancelFailed";
      results.push({ itemId: item._id, success: false, error: err.message });
    }
  }

  return results;
}