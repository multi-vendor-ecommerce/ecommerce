import dotenv from "dotenv";
import { get } from "mongoose";
dotenv.config();

const SR_EMAIL = process.env.SR_EMAIL;
const SR_PASSWORD = process.env.SR_PASSWORD;
const SR_BASE_URL = process.env.SR_BASE_URL;

if (!SR_EMAIL || !SR_PASSWORD || !SR_BASE_URL) {
  throw new Error("Missing Shiprocket environment variables");
}

let cachedToken = null;
let tokenExpiry = null;

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

  const data = await response.json();
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
  return data;
}

// Export it along with the other functions
export const ShiprocketClient = { getAdminToken, createOrder, addPickup, getPickups };
