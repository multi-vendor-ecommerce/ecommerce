import Vendor from "../models/Vendor.js";
import buildQuery from "../utils/queryBuilder.js";

// Public: Get all vendors
export const getAllVendors = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["name", "email", "shopName"]);
    
    const vendors = await Vendor.find(query);
    res.status(200).send({ success: true, message: "Vendors fetched successfully.", vendors });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error.", error: err.message, });
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