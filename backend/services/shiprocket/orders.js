import { shiprocketRequest } from "./client.js";

export const createShiprocketOrder = async (order) => {
  const payload = {
    order_id: order._id.toString(),
    order_date: new Date(order.createdAt).toISOString().slice(0, 19),
    pickup_location: process.env.SHIPROCKET_PICKUP,

    billing_customer_name: order.shippingInfo.recipientName,
    billing_last_name: "",
    billing_address: order.shippingInfo.line1,
    billing_address_2: order.shippingInfo.line2 || "",
    billing_city: order.shippingInfo.city,
    billing_pincode: order.shippingInfo.pincode,
    billing_state: order.shippingInfo.state,
    billing_country: "India",
    billing_email: order.user?.email || "test@example.com",
    billing_phone: order.shippingInfo.recipientPhone,

    order_items: order.orderItems.map((item) => ({
      name: item.product?.title || "Product",
      sku: item.product?._id?.toString(),
      units: item.quantity,
      selling_price: item.product?.price || 0,
    })),

    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total: order.totalAmount,

    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  };

  return await shiprocketRequest("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
