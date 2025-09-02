import Vendor from "../models/Vendor.js";
import buildQuery from "../utils/queryBuilder.js";
import { toTitleCase } from "../utils/titleCase.js";
import { sendApproveVendorMail } from "../services/email/sender.js";

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
      Vendor.countDocuments(query),
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
    const limit = Math.max(parseInt(req.query.limit) || 100, 1);
    const role = req.person?.role;

    let filter = { status: "active" };
    if (role === "vendor") {
      filter._id = req.person.id;
    }

    const vendors = await Vendor.find(filter)
      .sort({ totalRevenue: -1, totalSales: -1 })
      .limit(limit)
      .select(
        "name email shopName shopLogo gstNumber status totalSales totalRevenue commissionRate registeredAt"
      )
      .lean();

    res.status(200).json({
      success: true,
      message: vendors.length > 0
        ? "Top vendors loaded."
        : "No top vendors found.",
      vendors,
      total: vendors.length,
      limit
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
    ).select("shopName shopLogo");

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
    const vendor = await Vendor.findById(req.params.id);

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
// Approve vendor
// ==========================
export const approveVendor = async (req, res) => {
  try {
    let vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    // Send approval email to vendor
    try {
      await sendApproveVendorMail({
        to: vendor.email,
        vendorName: vendor.name,
        vendorShop: vendor.shopName
      });
    } catch (emailErr) {
      console.error("Vendor approval email failed:", emailErr);
      // Optionally log or ignore
    }

    res.status(200).json({
      success: true,
      vendor,
      message: "Vendor approved."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to approve vendor.", error: error.message });
  }
};