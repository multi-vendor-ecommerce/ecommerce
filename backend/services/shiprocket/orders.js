import { getVendorShiprocketToken } from "./client.js";

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

export const createVendorShiprocketOrder = async (order, vendor, user) => {
  const token = await getVendorShiprocketToken(vendor._id);

  const vendorItems = order.orderItems.filter(
    (i) => i.product?.createdBy?.toString() === vendor._id.toString()
  );

  if (vendorItems.length === 0) {
    throw new Error("No products found for this vendor in the order.");
  }

  if (!vendor.shiprocket.pickupLocation) {
    throw new Error("Pickup location not set for vendor.");
  }

  const vendorSubtotal = vendorItems.reduce(
    (sum, i) => sum + i.totalPrice * i.quantity,
    0
  );

  const payload = {
    order_id: `${order._id}-${vendor._id}`,
    order_date: new Date(order.createdAt).toISOString().slice(0, 16).replace("T", " "),
    pickup_location: vendor.shiprocket.pickupLocation,
    comment: `Order for ${vendor.shopName}`,

    billing_customer_name: user.name,
    billing_last_name: "",
    billing_address: order.shippingInfo.line1,
    billing_address_2: order.shippingInfo.line2 || "",
    billing_city: order.shippingInfo.city,
    billing_pincode: Number(order.shippingInfo.pincode),
    billing_state: order.shippingInfo.state,
    billing_country: "India",
    billing_email: user.email,
    billing_phone: Number(user.phone || "0000000000"),

    shipping_is_billing: true,
    shipping_customer_name: user.name,
    shipping_last_name: "",
    shipping_address: order.shippingInfo.line1,
    shipping_address_2: order.shippingInfo.line2 || "",
    shipping_city: order.shippingInfo.city,
    shipping_pincode: Number(order.shippingInfo.pincode),
    shipping_state: order.shippingInfo.state,
    shipping_country: "India",
    shipping_email: user.email,
    shipping_phone: Number(user.phone || "0000000000"),

    order_items: vendorItems.map(i => ({
      name: i.product.title,
      sku: i.product._id.toString(),
      units: i.quantity,
      selling_price: i.totalPrice,
      discount: 0,
      tax: 0,
      hsn: i.product.hsn || "",
    })),

    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    cod: order.paymentMethod === "COD" ? 1 : 0,

    sub_total: vendorSubtotal,
    shipping_charges: order.shippingCharges || 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,

    length: 10,
    breadth: 10,
    height: 10,
    weight: vendorItems.reduce((sum, i) => sum + ((i.product.weight || 500) / 1000 * i.quantity), 0)
  };


  console.log("Shiprocket payload:", JSON.stringify(payload, null, 2));

  const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Shiprocket order failed: ${data.message || JSON.stringify(data)}`);
  }

  return data;
};
