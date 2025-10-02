import { ShiprocketClient } from "./client.js";

export async function addVendorPickup(vendor) {
  if (vendor.shiprocket.pickupLocationCode) return; // already set

  try {
    // 1️⃣ Validate vendor address
    const { address, shopName, phone } = vendor;
    if (
      !address ||
      !address.line1 || address.line1.length < 10 ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      throw new Error(`Vendor ${shopName} has incomplete address. Please update before creating pickup.`);
    }

    // 2️⃣ Fetch existing pickups
    const existingPickupsResponse = await ShiprocketClient.getPickups();
    const existingPickups = existingPickupsResponse?.data || [];

    let pickupLocationName = shopName;
    const pickup = existingPickups.find(p => p.pickup_location === pickupLocationName);

    if (pickup) {
      if (pickup.status === 1) {
        // Reuse active pickup
        vendor.shiprocket.pickupLocationCode = pickup.pickup_code;
        await vendor.save();
        console.log(`Reused active pickup for ${shopName}`);
        return;
      } else {
        // Inactive → make unique
        console.log(`Pickup for ${shopName} is inactive. Creating new with unique name.`);
        pickupLocationName = `${shopName}-${Date.now()}`;
      }
    }

    // 3️⃣ Build payload
    const payload = {
      name: shopName || vendor.companyName || "Vendor",
      pickup_location: pickupLocationName,
      address: address.line1 + (address.line2 ? ", " + address.line2 : ""),
      city: address.city,
      state: address.state,
      country: address.country || "India",
      pin_code: address.pincode,
      email: process.env.SR_EMAIL,
      phone: phone || "9999999999",
    };

    if (address.geoLocation?.lat && address.geoLocation?.lng) {
      payload.latitude = address.geoLocation.lat;
      payload.longitude = address.geoLocation.lng;
    }

    // 4️⃣ Create pickup
    const response = await ShiprocketClient.addPickup(payload);
    const pickupCode = response?.address?.pickup_code;

    if (!pickupCode) {
      throw new Error(`Failed to create pickup for ${shopName}: ${JSON.stringify(response)}`);
    }

    vendor.shiprocket.pickupLocationCode = pickupCode;
    await vendor.save();
    console.log(`✅ Pickup created for vendor: ${shopName} (${pickupLocationName})`);

  } catch (err) {
    console.error(`❌ Shiprocket Pickup Error for ${vendor.shopName}:`, err.message);
    throw err;
  }
}