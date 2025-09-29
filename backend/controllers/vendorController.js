import Vendor from "../models/Vendor.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Products.js";
import Review from "../models/Review.js";
import buildQuery from "../utils/queryBuilder.js";
import { toTitleCase } from "../utils/titleCase.js";
import { sendVendorStatusMail, sendVendorApprovalStatusMail, sendVendorProfileUpdatedMail } from "../services/email/sender.js";
import { setNestedValueIfAllowed } from "../utils/setNestedValueIfAllowed.js";
import { safeSendMail } from "../utils/safeSendMail.js";

import { getVendorShiprocketToken } from "../services/shiprocket/client.js";
import { createVendorShiprocketOrder } from "../services/shiprocket/orders.js";
import { fetchShiprocketPickupLocations } from "../services/shiprocket/location.js";
import { addShiprocketPickupLocation } from "../services/shiprocket/addShiprocketPickupLocation.js";

// ==========================
// Get all vendors (paginated)
// ==========================
export const getAllVendors = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["name", "email", "shopName"]);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const [vendors, total] = await Promise.all([
      Vendor.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Vendor.countDocuments(query).select("-password"),
    ]);

    res.status(200).json({
      success: true,
      message: vendors.length > 0
        ? "Vendor list loaded."
        : "No vendors found.",
      vendors,
      total,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to load vendors.", error: err.message });
  }
};

// ==========================
// Get top vendors (by revenue/sales)
// ==========================
export const getTopVendors = async (req, res) => {
  try {
    // Use buildQuery for flexible searching
    let query = buildQuery(req.query, ["name", "email", "shopName"]);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 100, 1);
    const skip = (page - 1) * limit;
    const role = req.person?.role;

    // Only active vendors
    query.status = "active".toLowerCase();

    // Optionally, set minimum sales/revenue thresholds for "top" vendors
    query.totalSales = { $gte: 10 };      // e.g., at least 10 sales
    query.totalRevenue = { $gte: 1000 };  // e.g., at least $1000 revenue

    // If vendor is viewing, restrict to their own profile
    if (role === "vendor" && req.person?.id) {
      query._id = req.person.id;
    }

    // Sort by revenue, then sales, then product quantity
    const vendors = await Vendor.find(query)
      .sort({ totalRevenue: -1, totalSales: -1, productQuantity: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "name email phone shopName shopLogo gstNumber status totalSales totalRevenue commissionRate productQuantity registeredAt"
      )
      .lean();

    res.status(200).json({
      success: true,
      message: vendors.length > 0
        ? "Top vendors loaded."
        : "No top vendors found.",
      vendors,
      total: vendors.length,
      limit,
      page
    });
  } catch (err) {
    console.error("Error fetching top vendors:", err);
    res.status(500).json({ success: false, message: "Unable to load top vendors.", error: err.message });
  }
};

// ==========================
// Edit vendor store info
// ==========================
export const editStore = async (req, res) => {
  try {
    const { shopName } = req.body;
    let shopLogo = req.body.shopLogo || "";

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.person.id,
      {
        ...(shopName ? { shopName: toTitleCase(shopName.trim()) } : {}),
        ...(shopLogo ? { shopLogo } : {}),
      },
      { new: true, runValidators: true }
    ).select("name shopName shopLogo");

    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    res.status(200).json({
      success: true,
      message: "Store updated.",
      vendor: updatedVendor
    });
  } catch (error) {
    console.error("Error updating store:", error);
    res.status(500).json({ success: false, message: "Unable to update store.", error: error.message });
  }
};

// ==========================
// Get a vendor by id (public)
// ==========================
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select("-password");

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    res.status(200).json({
      success: true,
      message: "Vendor details loaded.",
      vendor
    });
  } catch (error) {
    console.error("getVendorById error:", error.message);
    res.status(500).json({ success: false, message: "Unable to load vendor details.", error: error.message });
  }
};

// ==========================
// Update vendor status
// ==========================
export const updateVendorStatus = async (req, res) => {
  let { status, review } = req.body;
  status = status.toLowerCase();
  review = review.trim() || "";

  try {
    const isValidStatus = ["pending", "active", "inactive", "suspended", "rejected"].includes(status);
    if (!isValidStatus) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    if (status === vendor.status) {
      return res.status(400).json({
        success: false,
        message: "Status is unchanged."
      });
    }

    if ((status === "pending" || status === "") && vendor.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "You cannot revert a vendor back to 'pending' once reviewed."
      });
    }

    vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("name email phone shopName status");

    // Update products for this vendor:
    // - When vendor is active => approved
    // - Otherwise => inactive
    // - Do not touch deleted or pendingDeletion products
    const targetProductStatus = status === "active" ? "approved" : "inactive";
    const productMatch = {
      createdBy: vendor._id,
      status: { $nin: ["deleted", "pendingDeletion"] }
    };

    const productUpdate = { status: targetProductStatus };

    const result = await Product.updateMany(productMatch, productUpdate);

    // Save a review record
    await Review.create({
      targetId: vendor?._id,
      targetType: toTitleCase("vendor"),
      adminId: req?.person.id,
      status: vendor?.status,
      review
    });

    // Send status email to vendor using safeSendMail
    if (status !== "pending" && status !== "") {
      await safeSendMail(sendVendorApprovalStatusMail, {
        to: vendor.email,
        vendorStatus: status === "active" ? "approved" : status === "inactive" ? "disabled" : status,
        vendorName: vendor.name,
        vendorShop: vendor.shopName,
        review
      });
    }

    res.status(200).json({
      success: true,
      vendor,
      message: `Vendor status updated to ${status}. Products updated (${result.modifiedCount}).`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update vendor status.",
      error: error.message
    });
  }
};

// ==========================
// Admin Edit Vendor
// ==========================
export const adminEditVendor = async (req, res) => {
  // Only allow these fields to be edited by admin
  const allowedFields = [
    "commissionRate",
    "address.recipientName", "address.recipientPhone",
    "address.line1", "address.line2", "address.locality",
    "address.city", "address.state", "address.country", "address.pincode",
    "address.geoLocation.lat", "address.geoLocation.lng"
  ];

  try {
    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    // Build update object only with allowed fields
    const update = {};

    // Traverse req.body and set only allowed fields
    const traverse = (obj, prefix = "") => {
      for (const key in obj) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (obj[key] !== null && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          traverse(obj[key], path);
        } else {
          setNestedValueIfAllowed(update, path, obj[key], allowedFields);
        }
      }
    };
    traverse(req.body);

    // Commission rate validation
    if (update.commissionRate !== undefined) {
      if (update.commissionRate === vendor.commissionRate) {
        return res.status(400).json({
          success: false,
          message: "Commission rate is unchanged.",
        });
      }
      if (update.commissionRate < 0 || update.commissionRate > 100) {
        return res.status(400).json({
          success: false,
          message: "Commission rate must be between 0 and 100.",
        });
      }
    }

    const forbiddenFields = ["_id", "email", "registeredAt", "totalSales", "totalRevenue"];
    for (const field of forbiddenFields) {
      delete update[field];
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update." });
    }

    // Format address for email if present
    let formattedAddress = "";
    let formattedRecipientName = "";
    let formattedRecipientPhone = "";
    if (update.address) {
      const addr = update.address;
      formattedAddress = [
        addr.line1,
        addr.line2,
        addr.locality,
        addr.city,
        addr.state,
        addr.country,
        addr.pincode,
      ].filter(Boolean).join(", ");

      if (addr.recipientName) {
        formattedRecipientName = addr.recipientName || "";
      }
      if (addr.recipientPhone) {
        formattedRecipientPhone = addr.recipientPhone || "";
      }
    }

    // Merge address fields if any address field is being updated
    if (update.address) {
      update.address = {
        ...vendor.address.toObject(), // existing address
        ...update.address             // updated fields
      };
    }

    // Now update the vendor with the merged address
    vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("name email phone shopName commissionRate address status");

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    // Try sending notification email (non-blocking)
    await safeSendMail(sendVendorProfileUpdatedMail, {
      to: vendor.email,
      vendorName: vendor.name,
      vendorShop: vendor.shopName,
      changes: Object.keys(update),
      data: {
        ...update,
        ...(update.address && { address: formattedAddress }),
        ...(formattedRecipientName && { recipientName: formattedRecipientName }),
        ...(formattedRecipientPhone && { recipientPhone: formattedRecipientPhone }),
      },
    });

    res.status(200).json({
      success: true,
      vendor,
      message: "Vendor details updated successfully.",
    });
  } catch (error) {
    console.error("Admin Edit Vendor Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update vendor details.",
      error: error.message,
    });
  }
};

// ==========================
// Vendor Reactivate Account
// =========================
export const reactivateVendorAccount = async (req, res) => {
  try {
    let vendor = await Vendor.findById(req.person.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    if (vendor.status !== "inactive") {
      return res.status(400).json({ success: false, message: "Only inactive vendors can reactivate their accounts." });
    }

    vendor = await Vendor.findByIdAndUpdate(
      req.person.id,
      { status: "pending" },
      { new: true }
    ).select("name email phone shopName status");

    await safeSendMail(sendVendorStatusMail, {
      to: process.env.ADMIN_EMAIL,
      vendorName: vendor.name,
      vendorShop: vendor.shopName,
      vendorEmail: vendor.email,
    });

    res.status(200).json({ success: true, vendor, message: "Account reactivation requested. Awaiting admin approval." });
  } catch (error) {
    console.error("Reactivate Vendor Account Error:", error);
    res.status(500).json({ success: false, message: "Unable to request account reactivation.", error: error.message });
  }
};

// ==========================
// Save Shiprocket Credentials (Vendor only)
// ==========================
export const saveShiprocketCredentials = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findById(req.person.id);

    if (!vendor || vendor.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Only vendors can save Shiprocket credentials."
      });
    }

    // Save credentials in DB
    vendor.shiprocket.email = email.trim().toLowerCase();
    vendor.shiprocket.password = password.trim();
    vendor.shiprocket.token = null;
    await vendor.save();

    // Get fresh token
    const token = await getVendorShiprocketToken(vendor._id);

    // Fetch pickup locations from Shiprocket
    const locations = await fetchShiprocketPickupLocations(token);

    if (!locations || locations.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "Shiprocket credentials saved successfully, but no pickup locations found. Please add a pickup address.",
        requirePickup: true,
      });
    }

    // Save all pickup locations
    vendor.shiprocket.pickupLocations = locations.map(loc => ({
      id: loc.id,
      pickup_location: loc.pickup_location,
      address: loc.address,
      city: loc.city,
      state: loc.state,
      country: loc.country,
      pin_code: loc.pin_code,
      name: loc.name,
      phone: loc.phone,
      email: loc.email,
      is_primary_location: loc.is_primary_location === 1
    }));

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Shiprocket credentials saved successfully.",
      pickupLocations: vendor.shiprocket.pickupLocations,
    });
  } catch (err) {
    console.error("Save Shiprocket credentials error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save Shiprocket credentials.",
      error: err.message,
    });
  }
};

// create a pickup location for the vendor
export const createVendorPickupLocation = async (req, res) => {
  try {
    const vendorId = req.person.id;
    const pickupInput = req.body;

    const result = await addShiprocketPickupLocation(vendorId, pickupInput);

    res.json({
      success: true,
      message: "Pickup location created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Create vendor pickup location error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get vendor token
export const getVendorShiprocketTokenController = async (req, res) => {
  try {
    const token = await getVendorShiprocketToken(req.params.vendorId);
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create Shiprocket order
export const createVendorShiprocketOrderController = async (req, res) => {
  try {
    const { orderId, vendorId, userId } = req.body;

    const order = await Order.findById(orderId).populate("orderItems.product");
    const vendor = await Vendor.findById(vendorId);
    const user = await User.findById(userId);

    if (!order || !vendor || !user) {
      return res.status(404).json({ success: false, message: "Order, Vendor, or User not found" });
    }

    const data = await createVendorShiprocketOrder(order, vendor, user);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};