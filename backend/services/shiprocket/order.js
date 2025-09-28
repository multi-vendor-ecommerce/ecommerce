// services/shiprocket/pushOrder.js
import { ShiprocketClient } from "./client.js";
import Order from "../../models/Order.js";
import Vendor from "../../models/Vendor.js";

export async function pushOrderToShiprocket(orderId) {
  const order = await Order.findById(orderId)
    .populate("orderItems.product")
    .populate("user", "name email phone")
    .exec();

  if (!order) throw new Error("Order not found");

  // 🔹 Group items vendor-wise
  const vendorGroups = {};
  for (const item of order.orderItems) {
    const vendorId = item.product.createdBy?.toString();
    if (!vendorId) continue;
    if (!vendorGroups[vendorId]) vendorGroups[vendorId] = [];
    vendorGroups[vendorId].push(item);
  }

  // 🔹 Loop vendor-wise
  for (const [vendorId, items] of Object.entries(vendorGroups)) {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new Error(`Vendor ${vendorId} not found`);

    // 🔹 Use vendor's registered Shiprocket pickup code
    // Default fallback: first available pickup code
    const pickup_location = vendor.pickupLocationCode || "work"; // must match Shiprocket registered code
    const pickup_name = vendor.name;
    const pickup_phone = vendor.phone;
    const pickup_email = vendor.email || "";

    // Delivery details (customer)
    const shipping = order.shippingInfo || {};
    const billing_customer_name = shipping.recipientName || order.user.name;
    const billing_phone = shipping.recipientPhone || order.user.phone;
    const billing_email = order.user.email || "";

    // Items payload
    const order_items = items.map((item) => ({
      name: item.product.title,
      sku: item.product._id.toString(),
      units: item.quantity,
      selling_price: item.totalPrice,
    }));

    // Shiprocket payload
    const payload = {
      order_id: `${order._id}-${vendorId}`,
      order_date: new Date().toISOString(),
      pickup_location, 
      pickup_name,
      pickup_phone,
      pickup_email,

      billing_customer_name,
      billing_last_name: "",
      billing_address: shipping.line1,
      billing_address_2: shipping.line2 || "",
      billing_city: shipping.city,
      billing_state: shipping.state,
      billing_country: shipping.country || "India",
      billing_pincode: shipping.pincode,
      billing_email,
      billing_phone,

      shipping_is_billing: true,
      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      order_items,
      sub_total: items.reduce((sum, i) => sum + i.totalPrice, 0),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    console.log("Shiprocket Payload:\n", payload);

    const response = await ShiprocketClient.createOrder(payload);
    console.log("Shiprocket Response:\n", JSON.stringify(response, null, 2));

    // Save Shiprocket info per item
    items.forEach((item) => {
      item.shiprocketOrderId = response.order_id || "";
      item.shiprocketShipmentId = response.shipment_id || "";
      item.shiprocketAWB = response.awb_code || "";
      item.courierName = response.courier_company || "";
      item.labelUrl = response.label_url || "";
    });
  }

  await order.save();
  return order;
}
