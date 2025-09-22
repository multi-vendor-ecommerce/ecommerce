// services/shiprocket/addShiprocketPickupLocation.js
import fetch from "node-fetch";
import Vendor from "../../models/Vendor.js";
import { getVendorShiprocketToken } from "./client.js";

/**
 * Add a Shiprocket pickup location for a vendor
 * @param {string} vendorId - Vendor MongoDB ID
 * @param {object} pickupInput - Pickup data from request
 * @returns {object} - Shiprocket API response
 */
export const addShiprocketPickupLocation = async (vendorId, pickupInput) => {
    // Fetch vendor from DB
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");

    // Get Shiprocket token
    const token = await getVendorShiprocketToken(vendorId);
    console.log(pickupInput);
    // Prepare pickup data
    const pickupData = {
        pickup_location: vendor.shopName || "My Shop",
        name: pickupInput?.name || vendor.name,
        email: pickupInput?.email || vendor.email,
        phone: pickupInput?.phone || vendor.phone,
        address: pickupInput?.address || vendor.address?.line1 || "",
        city: pickupInput?.city || vendor.address?.city || "",
        state: pickupInput?.state || vendor.address?.state || "",
        country: pickupInput?.country || vendor.address?.country || "India",
        pin_code: pickupInput?.pincode || vendor.address?.pincode || ""
    };

    // Call Shiprocket API
    const response = await fetch("https://apiv2.shiprocket.in/v1/external/settings/company/addpickup", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pickupData)
    });

    let result = {};
    try {
        // Only parse JSON if body exists
        const text = await response.text();
        result = text ? JSON.parse(text) : {};
    } catch (err) {
        console.error("Failed to parse Shiprocket response:", err);
        result = {};
    }

    if (!response.ok) {
        throw new Error(`Failed to create pickup location: ${JSON.stringify(result)}`);
    }

    // Save in DB
    vendor.shiprocket.pickupLocation = pickupData.pickup_location;
    vendor.shiprocket.pickupLocationId = result?.data?.id || null;
    await vendor.save();

    return result;
};
