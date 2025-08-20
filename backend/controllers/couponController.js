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

// Edit a coupon
export const editCoupon = async (req, res) => {
  try {
    const { code, discount, minPurchase, maxDiscount, expiryDate, usageLimit, isActive } = req.body;

    // Check if coupon exists
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(400).json({ success: false, message: "Coupon not found!" });
    }

    // Check for duplicate code if code is being updated
    if (code && code.toUpperCase() !== coupon.code) {
      const existing = await Coupon.findOne({ code: code.toUpperCase() });
      if (existing && existing._id.toString() !== coupon._id.toString()) {
        return res.status(400).json({ success: false, message: "Coupon code already exists." });
      }
    }

    // Build update object dynamically
    const updateData = {};
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (discount !== undefined) updateData.discount = discount;
    if (minPurchase !== undefined) updateData.minPurchase = minPurchase;
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      coupon: updatedCoupon,
    });
  } catch (err) {
    console.error("Error editing coupon:", err);
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};

// Delete a coupon
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

