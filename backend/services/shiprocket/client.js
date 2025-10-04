import dotenv from "dotenv";
dotenv.config();

const SR_EMAIL = process.env.SR_EMAIL;
const SR_PASSWORD = process.env.SR_PASSWORD;
const SR_BASE_URL = process.env.SR_BASE_URL;

if (!SR_EMAIL || !SR_PASSWORD || !SR_BASE_URL) {
  throw new Error("Missing Shiprocket environment variables");
}

let cachedToken = null, tokenExpiry = null;

async function getAdminToken() {
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(`${SR_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: SR_EMAIL, password: SR_PASSWORD }),
  });

  const data = await response.json();

  console.log(data)
  if (!data.token) {
    throw new Error(`Shiprocket login failed: ${JSON.stringify(data)}`);
  }

  cachedToken = data.token;
  tokenExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000);
  return cachedToken;
}

async function createOrder(orderPayload) {
  const token = await getAdminToken();

  const response = await fetch(`${SR_BASE_URL}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Shiprocket order creation failed: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

async function addPickup(pickupPayload) {
  const token = await getAdminToken();

  const response = await fetch(`${SR_BASE_URL}/settings/company/addpickup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pickupPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Shiprocket add pickup failed: ${JSON.stringify(errorData)}`);
  }

  return await response?.json();
}

async function getPickups() {
  const token = await getAdminToken();
  const response = await fetch(`${SR_BASE_URL}/settings/company/getpickups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Shiprocket get pickups failed: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

// client.js
export async function assignAWB(shipment_id) {
  if (!shipment_id) throw new Error("Shipment ID required for AWB assignment");

  const token = await getAdminToken();
  const response = await fetch(`${SR_BASE_URL}/courier/assign/awb`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shipment_id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Shiprocket AWB assignment failed: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

async function generateDocuments(shipment_id, order_id) {
  if (!shipment_id) throw new Error("Shipment ID required for document generation");

  const token = await getAdminToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Generate Label
  const labelRes = await fetch(`${SR_BASE_URL}/courier/generate/label`, {
    method: "POST",
    headers,
    body: JSON.stringify({ shipment_id: [shipment_id] }),
  }).then(res => res.json());

  // Generate Invoice
  const invoiceRes = await fetch(`${SR_BASE_URL}/orders/print/invoice`, {
    method: "POST",
    headers,
    body: JSON.stringify({ ids: [order_id] }),
  }).then(res => res.json());

  // Generate Manifest
  const manifestRes = await fetch(`${SR_BASE_URL}/manifests/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({ shipment_id: [shipment_id] }),
  }).then(res => res.json());

  return {
    labelUrl: labelRes?.label_url || null,
    invoiceUrl: invoiceRes?.invoice_url || null,
    manifestUrl: manifestRes?.manifest_url || null,
    raw: { labelRes, invoiceRes, manifestRes }, // keep raw responses for debugging
  };
}

async function trackShipment(shipment_id) {
  if (!shipment_id) throw new Error("Shipment ID required for tracking");

  const token = await getAdminToken();

  // Track Shipment
  const response = await fetch(`${SR_BASE_URL}/courier/track/shipment/${shipment_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Shiprocket tracking failed: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

// Export it along with the other functions
export const ShiprocketClient = {
  getAdminToken,
  createOrder,
  addPickup,
  getPickups,
  assignAWB,
  generateDocuments,
  trackShipment,
};