import Coupon from "../models/Coupon.js";

// Get all coupons with pagination
export const getAllCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      Coupon.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Coupon.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: "Coupons fetched successfully.",
      coupons,
      total,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching coupons.",
      error: err.message,
    });
  }
};

// Create a new category
export const addCoupon = async (req, res) => {
  try {
    const { code, discount, minPurchase, maxDiscount, expiryDate, usageLimit, isActive } = req.body;

    // Check if coupon with same code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists." });
    }

    const newCoupon = await Coupon.create({ code: code.toUpperCase(), discount, minPurchase, maxDiscount, expiryDate, usageLimit, isActive });
    res.status(201).json({ success: true, message: "Coupon created successfully.", coupon: newCoupon });
  } catch (err) {
    console.error("Error adding coupon:", err);
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};

// Delete a new category
export const deleteCoupon = async (req, res) => {
  try {
    let coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(400).json({ success: false, message: "Coupon not found!" });
    }

    // Check if coupon with same code already exists
    coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Given coupon has been deleted successfully!", coupon });
  } catch (err) {
    console.error("Error adding coupon:", err);
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};

