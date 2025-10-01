// services/shiprocket/pushOrder.js
import { ShiprocketClient } from "./client.js";
import Order from "../../models/Order.js";
import Vendor from "../../models/Vendor.js";
import { formatDate } from "../../utils/formatDate.js";

export async function pushOrderToShiprocket(orderId) {
  const order = await Order.findById(orderId)
    .populate("orderItems.product")
    .populate("user", "name email phone")
    .exec();

  if (!order) throw new Error("Order not found");

  // Group items by vendor
  const vendorGroups = {};
  for (const item of order.orderItems) {
    const vendorId = item.product.createdBy?.toString();
    if (!vendorId) continue;
    if (!vendorGroups[vendorId]) vendorGroups[vendorId] = [];
    vendorGroups[vendorId].push(item);
  }

  for (const [vendorId, items] of Object.entries(vendorGroups)) {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new Error(`Vendor ${vendorId} not found`);

    const pickup_location = vendor.shiprocket.pickupLocationCode;

    if (!pickup_location) {
      throw new Error(`Vendor ${vendor.shopName} does not have a Shiprocket pickup location.`);
    }

    const shipping = order.shippingInfo;
    if (!shipping?.line1 || !shipping?.city || !shipping?.state || !shipping?.pincode) {
      throw new Error("Order is missing required shipping address fields");
    }

    const payload = {
      order_id: `${order._id}-${vendorId}`.substring(0, 50), // Max 50 chars
      order_date: formatDate(),
      pickup_location,

      // Billing info
      billing_customer_name: shipping.recipientName || order.user.name,
      billing_last_name: "", // optional
      billing_address: shipping.line1,
      billing_address_2: shipping.line2 || "",
      billing_city: shipping.city,
      billing_state: shipping.state,
      billing_country: shipping.country || "India",
      billing_pincode: parseInt(shipping.pincode, 10),
      billing_email: order.user.email,
      billing_phone: parseInt(shipping.recipientPhone || order.user.phone, 10),

      // Shipping info (even if shipping_is_billing is true, always include required fields)
      shipping_is_billing: true,
      shipping_customer_name: shipping.recipientName || order.user.name,
      shipping_last_name: "",
      shipping_address: shipping.line1,
      shipping_address_2: shipping.line2 || "",
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      shipping_country: shipping.country || "India",
      shipping_pincode: parseInt(shipping.pincode, 10),
      shipping_phone: parseInt(shipping.recipientPhone || order.user.phone || "0", 10), // must include

      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",

      order_items: items.map(item => ({
        name: item.product.title,
        sku: item.product._id.toString(),
        units: item.quantity,
        selling_price: item.totalPrice,
      })),

      sub_total: items.reduce((sum, i) => sum + i.totalPrice, 0),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,

      // Optional fields that might prevent errors
      invoice_number: order.invoiceNumber ? order.invoiceNumber.substring(0, 50) : undefined, // max 50 chars
      order_type: "NON ESSENTIALS",
    };

    console.log("Shiprocket Payload:\n", payload);

    const response = await ShiprocketClient.createOrder(payload);
    console.log("Shiprocket Response:\n", JSON.stringify(response, null, 2));

    // Save Shiprocket info per item
    items.forEach(item => {
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