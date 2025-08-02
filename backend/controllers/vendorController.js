import Vendor from "../models/Vendor.js";
import buildQuery from "../utils/queryBuilder.js";

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