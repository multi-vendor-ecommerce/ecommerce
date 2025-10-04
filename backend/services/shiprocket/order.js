// services/shiprocket/pushOrder.js
import { ShiprocketClient } from "./client.js";
import { buildShiprocketPayload } from "./payloadBuilder.js";

export async function pushOrderToShiprocket(orderId) {
  const payloads = await buildShiprocketPayload(orderId);

  for (const { vendorId, order, items, payload } of payloads) {
    console.log("Shiprocket Payload for vendor:", vendorId, payload);

    try {
      const response = await ShiprocketClient.createOrder(payload);
      console.log("Shiprocket Response for vendor:", vendorId, response);

      let awbResponse = {}, docsResponse = {};
      if (response?.shipment_id) {
        try {
          // Assign AWB
          awbResponse = await ShiprocketClient.assignAWB(response.shipment_id);
          console.log("AWB Response for vendor:", vendorId, awbResponse);

          // Generate Label, Invoice, Manifest
          docsResponse = await ShiprocketClient.generateDocuments(response.shipment_id, response.order_id);
          console.log("Docs Response for vendor:", vendorId, docsResponse);

        } catch (awbErr) {
          console.error("AWB/Docs generation failed for shipment:", response.shipment_id, awbErr.message);
        }
      } else {
        console.error("No shipment ID returned for vendor:", vendorId);
      }

      items.forEach(item => {
        item.shiprocketOrderId = response.order_id || "";
        item.shiprocketShipmentId = response.shipment_id || "";
        item.shiprocketAWB = response.awb_code || response.awb_code || "";
        item.shiprocketStatus = response.status || ""; 
        item.shiprocketStatusCode = response.status_code || null;
        item.courierName = response.courier_company || "";

        item.labelUrl = docsResponse.labelUrl || "";
        item.invoiceUrl = docsResponse.invoiceUrl || "";
        item.manifestUrl = docsResponse.manifestUrl || "";
      });

      await order.save();
    } catch (err) {
      console.error("Failed to create Shiprocket order for vendor", vendorId, err.message);
    }
  }

  return payloads.map(p => p.order); // Return updated orders
}