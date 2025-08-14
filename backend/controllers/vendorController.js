import Vendor from "../models/Vendor.js";
import buildQuery from "../utils/queryBuilder.js";
import { toTitleCase } from "../utils/titleCase.js";

// Public: Get all vendors (paginated)
export const getAllVendors = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["name", "email", "shopName", "status"]);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
      message: "Vendors fetched successfully.",
      vendors,
      total,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};

export const getTopVendors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const role = req.person?.role;

    // Base filter
    let filter = { status: "active" };

    // Vendors can only see their own stats
    if (role === "vendor") {
      filter._id = req.person.id;
    }

    // Fetch top vendors sorted by totalRevenue, then totalSales
    const vendors = await Vendor.find(filter)
      .sort({ totalRevenue: -1, totalSales: -1 })
      .limit(limit)
      .select(
        "name email shopName shopLogo gstNumber status totalSales totalRevenue commissionRate registeredAt"
      )
      .lean();

    res.status(200).json({ success: true, message: "Top vendors fetched successfully.", vendors, total: vendors.length, limit });
  } catch (err) {
    console.error("Error fetching top vendors:", err);
    res.status(500).json({ success: false, message: "Failed to fetch top vendors.", error: err.message });
  }
};

export const editStore = async (req, res) => {
  try {
    const { shopName } = req.body;
    let shopLogo = req.body.shopLogo || "";

    // If a new file is uploaded, send to Cloudinary
    if (req.file && req.file.path) {
      shopLogo = req.file.path;
    }

    // Update only allowed fields
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.person.id,
      {
        ...(shopName ? { shopName: toTitleCase(shopName.trim()) } : {}),
        ...(shopLogo ? { shopLogo } : {}),
      },
      { new: true, runValidators: true }
    ).select("shopName shopLogo");

    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    console.log(updatedVendor)

    res.status(200).json({ success: true, message: "Store updated successfully", vendor: updatedVendor });
  } catch (error) {
    console.error("Error updating store:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Public: Get a vendor by id
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    res.status(200).json({ success: true, message: "Vendor fetched successfully.", vendor });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error.", error: err.message, });
  }
}