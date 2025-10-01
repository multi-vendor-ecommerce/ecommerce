import { ShiprocketClient } from "./client.js";

export async function addVendorPickup(vendor) {
  if (vendor.shiprocket.pickupLocationCode) return; // already set

  try {
    // 1️⃣ Fetch existing pickups
    const existingPickupsResponse = await ShiprocketClient.getPickups();
    const existingPickups = existingPickupsResponse?.data || [];

    let pickupLocationName = vendor.shopName;
    let pickup = existingPickups.find(p => p.pickup_location === pickupLocationName);

    if (pickup) {
      if (pickup.status === 1) {
        // Reuse active
        vendor.shiprocket.pickupLocationCode = pickup.pickup_code;
        await vendor.save();
        console.log(`Reused active pickup for ${vendor.shopName}`);
        return;
      } else {
        // Inactive → make unique
        console.log(`Pickup for ${vendor.shopName} is inactive. Creating new with unique name.`);
        pickupLocationName = `${vendor.shopName}-${Date.now()}`;
      }
    }

    // 2️⃣ Build address
    const addressLine = (vendor?.address?.line1 && vendor.address.line1.length >= 10)
      ? vendor.address.line1 + (vendor.address.line2 ? ", " + vendor.address.line2 : "")
      : "Flat 1, Road 123, Sector 45";

    const payload = {
      name: vendor.shopName || vendor.companyName || "Vendor",
      pickup_location: pickupLocationName,
      address: addressLine,
      city: vendor?.address?.city || "Test City",
      state: vendor?.address?.state || "Test State",
      country: vendor?.address?.country || "India",
      pin_code: vendor?.address?.pincode || "110001",
      email: process.env.SR_EMAIL,
      phone: vendor?.phone || "9999999999"
    };

    if (vendor?.address?.geoLocation?.lat && vendor?.address?.geoLocation?.lng) {
      payload.latitude = vendor.address.geoLocation.lat;
      payload.longitude = vendor.address.geoLocation.lng;
    }

    // 3️⃣ Create pickup
    const response = await ShiprocketClient.addPickup(payload);
    const pickupCode = response?.address?.pickup_code;

    if (!pickupCode) {
      throw new Error(`Failed to create pickup for ${vendor.shopName}: ${JSON.stringify(response)}`);
    }

    vendor.shiprocket.pickupLocationCode = pickupCode;
    await vendor.save();
    console.log(`✅ Pickup created for vendor: ${vendor.shopName} (${pickupLocationName})`);

  } catch (err) {
    console.error(`❌ Shiprocket Pickup Error for ${vendor.shopName}:`, err.message);
    throw err;
  }
}