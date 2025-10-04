// controllers/shiprocketController.js
import { ShiprocketClient } from "../services/shiprocket/client.js";
import Order from "../models/Order.js";

export const trackOrder = async (req, res) => {
  const { shipment_id } = req.params;
  if (!shipment_id) {
    return res.status(400).json({ error: "Shipment ID required" });
  }

  try {
    // 1️⃣ Get tracking from Shiprocket API
    const trackingData = await ShiprocketClient.trackShipment(shipment_id);

    // 2️⃣ Find the order that has this shipment
    const order = await Order.findOne({ "orderItems.shiprocketShipmentId": shipment_id });

    if (!order) {
      // Instead of error, return tracking data so user/vendor can still see it
      return res.status(200).json({
        success: true,
        message: "Tracking data fetched (order not found in DB)",
        trackingData,
      });
    }

    // 3️⃣ Vendor authorization check (for multi-vendor platform)
    if (req.person.role === "vendor") {
      const ownsShipment = order.orderItems.some(
        item =>
          item.shiprocketShipmentId === shipment_id &&
          item.createdBy.toString() === req.person.id
      );

      if (!ownsShipment) {
        return res.status(403).json({ error: "Unauthorized: not your order" });
      }
    }

    // 4️⃣ Update matching item’s tracking data
    order.orderItems.forEach(item => {
      if (item.shiprocketShipmentId === shipment_id) {
        item.trackingData = trackingData;
        item.shiprocketStatus =
          trackingData?.tracking_data?.shipment_track?.current_status || item.shiprocketStatus;
      }
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Tracking data fetched and updated successfully",
      trackingData,
    });
  } catch (err) {
    console.error("🚨 Shiprocket tracking error:", err.message);
    res.status(500).json({ error: err.message });
  }
};