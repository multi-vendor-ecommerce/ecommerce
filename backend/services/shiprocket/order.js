// services/shiprocket/pushOrder.js
import { ShiprocketClient } from "./client.js";
import Order from "../../models/Order.js";
import Vendor from "../../models/Vendor.js";
import { formatDate } from "../../utils/formatDate.js";

export async function pushOrderToShiprocket(orderId) {
  const order = await Order.findById(orderId)
    .populate("orderItems.product")
    .populate("user", "name email phone address")
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

    const pickup_location = vendor?.shiprocket?.pickupLocationCode;
    if (!pickup_location) {
      throw new Error(`Vendor ${vendor.shopName} does not have a Shiprocket pickup location.`);
    }

    const shipping = order.shippingInfo;
    if (!shipping?.line1 || !shipping?.city || !shipping?.state || !shipping?.pincode) {
      throw new Error("Order is missing required shipping address fields");
    }

    // Default values for missing dimensions/weight
    const defaultDim = 10; // cm
    const defaultWeight = 0.5; // kg

    // Calculate max length/breadth and stacked height
    let maxLength = 0, maxBreadth = 0, stackedHeight = 0, totalWeight = 0;
    items.forEach(item => {
      const prod = item.product;
      const length = prod.length || defaultDim;
      const breadth = prod.breadth || defaultDim;
      const height = prod.height || defaultDim;
      const weight = prod.weight || defaultWeight;

      if (length > maxLength) maxLength = length;
      if (breadth > maxBreadth) maxBreadth = breadth;
      stackedHeight += height * item.quantity;
      totalWeight += weight * item.quantity;
    });

    const payload = {
      order_id: `${order._id}-${vendorId}`.substring(0, 50), // Max 50 chars
      order_date: formatDate(),
      pickup_location,

      // Billing info = always user
      billing_customer_name: order.user.name || "Customer",
      billing_last_name: "",
      billing_address: order.user.address.line1,
      billing_address_2: order.user.address.line2 || "",
      billing_city: order.user.address.city,
      billing_state: order.user.address.state,
      billing_country: order.user.address.country || "India",
      billing_pincode: parseInt(order.user.address.pincode, 10),
      billing_email: order.user.email,
      billing_phone: parseInt(order.user.phone, 10),

      // Shipping info = recipient first, fallback user
      shipping_is_billing: true,
      shipping_customer_name: shipping.recipientName || order.user.name,
      shipping_last_name: "",
      shipping_address: shipping.line1,
      shipping_address_2: shipping.line2 || "",
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      shipping_country: shipping.country || "India",
      shipping_pincode: parseInt(shipping.pincode, 10),
      shipping_phone: parseInt(shipping.recipientPhone || order.user.phone || "0", 10),

      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",

      order_items: items.map(item => ({
        name: item.product.title,
        sku: item.product.sku || item.product._id.toString(),
        hsn: item.product.hsnCode || "",
        units: item.quantity,
        selling_price: item.totalPrice,
        discount: item.discountAmount,
        tax: item.gstRate,
      })),

      shipping_charges: order.shippingCharges,
      total_discount: order.totalDiscount,
      sub_total: order.subTotal,
      length: maxLength,
      breadth: maxBreadth,
      height: stackedHeight,
      weight: totalWeight,

      invoice_number: order.invoiceNumber ? order.invoiceNumber.substring(0, 50) : undefined,
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