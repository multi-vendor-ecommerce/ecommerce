import Vendor from "../../models/Vendor.js";
import { fetchShiprocketPickupLocations } from "./location.js";

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

export const getVendorShiprocketToken = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) throw new Error("Vendor not found");

  // Return cached token if valid
  if (vendor.shiprocket.token && vendor.shiprocket.tokenExpiresAt > new Date()) {
    return vendor.shiprocket.token;
  }

  // Authenticate vendor
  const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: vendor.shiprocket.email,
      password: vendor.shiprocket.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Shiprocket login failed: ${response.statusText}`);
  }

  const data = await response.json();

  // Save token and expiry
  vendor.shiprocket.token = data.token;
  vendor.shiprocket.tokenExpiresAt = new Date(Date.now() + 23 * 60 * 60 * 1000); // ~23h

  // Fetch pickup locations if not set
  const locations = await fetchShiprocketPickupLocations(data.token);
  if (locations.length > 0) {
    vendor.shiprocket.pickupLocation = locations[0].pickup_location;
    vendor.shiprocket.pickupLocationId = locations[0].id;
  }

  await vendor.save();
  return data.token;
};
