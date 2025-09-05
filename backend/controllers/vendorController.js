import Vendor from "../models/Vendor.js";
import Product from "../models/Products.js"; // Add this import at the top
import buildQuery from "../utils/queryBuilder.js";
import { toTitleCase } from "../utils/titleCase.js";
import { sendVendorStatusMail, sendVendorApprovalStatusMail, sendVendorProfileUpdatedMail } from "../services/email/sender.js";

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
    query.status = "active";

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
  const { status } = req.body;

  try {
    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    // 🚨 Prevent setting back to "pending"
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

    // Update all products for this vendor
    await Product.updateMany(
      { createdBy: vendor._id },
      { status: status === "active" ? "approved" : "inactive" }
    );

    // Send status email to vendor
    try {
      if (status !== "pending" && status !== "") {
        await sendVendorApprovalStatusMail({
          to: vendor.email,
          vendorStatus: status === "active" ? "approved" : status === "inactive" ? "disabled" : status,
          vendorName: vendor.name,
          vendorShop: vendor.shopName,
          reason: req.body.reason || "",
        });
      }
    } catch (emailErr) {
      console.error("Vendor status email failed:", emailErr);
    }

    res.status(200).json({
      success: true,
      vendor,
      message: `Vendor status updated to ${status}. Products updated as well.`
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
  const { commissionRate, gstNumber } = req.body;
  try {
    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    // Build update object only with provided fields
    const update = {};
    if (commissionRate !== undefined) {
      if (commissionRate < 0 || commissionRate > 100) {
        return res.status(400).json({
          success: false,
          message: "Commission rate must be between 0 and 100.",
        });
      }
      update.commissionRate = commissionRate;
    }
    if (gstNumber !== undefined) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(gstNumber)) {
        return res.status(400).json({
          success: false,
          message: "Invalid GST number format.",
        });
      }
      update.gstNumber = gstNumber;
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update." });
    }

    const forbiddenFields = ["_id", "email", "registeredAt", "totalSales", "totalRevenue"];
    for (const field of forbiddenFields) {
      delete update[field];
    }

    vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("name email phone shopName commissionRate gstNumber status");

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    // Try sending notification email (non-blocking)
    try {
      await sendVendorProfileUpdatedMail({
        to: vendor.email,
        vendorName: vendor.name,
        vendorShop: vendor.shopName,
        changes: Object.keys(update),
        data: update,
      });
    } catch (emailErr) {
      console.error("Vendor profile updated email failed:", emailErr);
    }

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

    try {
      await sendVendorStatusMail({
        to: process.env.ADMIN_EMAIL,
        vendorName: vendor.name,
        vendorShop: vendor.shopName,
        vendorEmail: vendor.email,
      });
    } catch (emailErr) {
      console.error("Vendor status email failed:", emailErr);
    }

    res.status(200).json({ success: true, vendor, message: "Account reactivation requested. Awaiting admin approval." });
  } catch (error) {
    console.error("Reactivate Vendor Account Error:", error);
    res.status(500).json({ success: false, message: "Unable to request account reactivation.", error: error.message });
  }
};