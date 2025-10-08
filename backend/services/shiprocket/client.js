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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Shiprocket tracking failed: ${JSON.stringify(data)}`);
  }

  return data;
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Shiprocket tracking failed: ${JSON.stringify(data)}`);
  }

  return data;
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Shiprocket tracking failed: ${JSON.stringify(data)}`);
  }

  return data;
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Shiprocket tracking failed: ${JSON.stringify(data)}`);
  }

  return data;
}

async function generateDocuments(shipmentIds, orderIds) {
  if (!shipmentIds || (Array.isArray(shipmentIds) && shipmentIds.length === 0)) {
    throw new Error("At least one shipment ID is required for document generation");
  }

  const token = await getAdminToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const shipmentArray = Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds];
  const orderArray = Array.isArray(orderIds) ? orderIds : [orderIds];

  // Helper to safely fetch JSON + handle Shiprocket errors
  const safeFetch = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || data?.status_code === 400 || data?.status === "error") {
      console.error("Shiprocket API error:", data);
      throw new Error(data?.message || `Shiprocket request failed: ${url}`);
    }
    return data;
  };

  // 1️⃣ Generate Label
  const labelRes = await safeFetch(`${SR_BASE_URL}/courier/generate/label`, {
    shipment_id: shipmentArray,
  });

  // 2️⃣ Generate Invoice
  const invoiceRes = await safeFetch(`${SR_BASE_URL}/orders/print/invoice`, {
    ids: orderArray,
  });

  // 3️⃣ Generate Manifest
  const manifestRes = await safeFetch(`${SR_BASE_URL}/manifests/generate`, {
    shipment_id: shipmentArray,
  });

  return {
    labelUrl: labelRes?.label_url || null,
    invoiceUrl: invoiceRes?.invoice_url || null,
    manifestUrl: manifestRes?.manifest_url || null,
    raw: { labelRes, invoiceRes, manifestRes },
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Shiprocket tracking failed: ${JSON.stringify(data)}`);
  }

  return data;
}

async function cancelOrder(ids) {
  if (!ids || (Array.isArray(ids) && ids.length === 0)) {
    throw new Error("At least one order ID is required to cancel");
  }

  const token = await getAdminToken();
  const response = await fetch(`${SR_BASE_URL}/orders/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids: Array.isArray(ids) ? ids : [ids] }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Shiprocket tracking failed: ${JSON.stringify(data)}`);
  }

  return data;
}

async function returnOrder(returnPayload) {
  if (!returnPayload || !returnPayload.order_id) {
    throw new Error("Valid return payload with order ID is required for return");
  }
  const token = await getAdminToken();

  const response = await fetch(`${SR_BASE_URL}/orders/create/return`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ returnPayload }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Shiprocket return order failed: ${JSON.stringify(data)}`);
  }

  return data;
}

export const ShiprocketClient = {
  getAdminToken,
  createOrder,
  addPickup,
  getPickups,
  assignAWB,
  generateDocuments,
  trackShipment,
  cancelOrder,
  returnOrder,
};