import cloudinary from "../config/cloudinary.js";
import Person from "../models/Person.js";
import Product from "../models/Products.js";
import Vendor from "../models/Vendor.js";

/**
 * DELETE IMAGE
 * Remove an image from Cloudinary + DB
 */
export const deleteImage = async (req, res) => {
  try {
    const { publicId, type, targetId } = req.body;
    // type = "profile" | "product"

    if (!publicId || !type || !targetId) {
      return res.status(400).json({ success: false, message: "publicId, type, and targetId are required" });
    }

    // 1. Remove from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // 2. Update DB
    if (type === "profile") {
      await Person.findByIdAndUpdate(targetId, { $set: { profileImage: "", profileImageId: "" } });
    }

    if (type === "product") {
      await Product.findByIdAndUpdate(targetId, { $pull: { images: { public_id: publicId } } });
    }

    // NEW: Shop Logo
    if (type === "shopLogo") {
      await Vendor.findByIdAndUpdate(targetId, { $set: { shopLogo: "", shopLogoId: "" } });
    }

    res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete Image Error:", err);
    res.status(500).json({ success: false, message: "Server error while deleting image", error: err.message });
  }
};

/**
 * EDIT IMAGE
 * Replace an image in Cloudinary + DB
 */
export const editImage = async (req, res) => {
  try {
    const { oldPublicId, type, targetId } = req.body;
    // req.file contains new image (via multer)

    if (!req.file || !type || !targetId) {
      return res.status(400).json({ success: false, message: "new file, type, and targetId are required" });
    }

    // 1. Delete old image from Cloudinary
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    // 2. Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: type === "profile" ? "profiles" : type === "shopLogo" ? "shopLogos" : "products",
    });

    // 3. Update DB
    if (type === "profile") {
      await Person.findByIdAndUpdate(
        targetId,
        { $set: { profileImage: result.secure_url, profileImageId: result.public_id } },
        { new: true }
      );
    }

    if (type === "product") {
      await Product.findOneAndUpdate(
        { _id: targetId, "images.public_id": oldPublicId },
        { $set: { "images.$": { url: result.secure_url, public_id: result.public_id } } },
        { new: true }
      );
    }

    // NEW: Shop Logo
    if (type === "shopLogo") {
      await Vendor.findByIdAndUpdate(
        targetId,
        { $set: { shopLogo: result.secure_url, shopLogoId: result.public_id } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      newImage: { url: result.secure_url, public_id: result.public_id }
    });
  } catch (err) {
    console.error("Edit Image Error:", err);
    res.status(500).json({ success: false, message: "Server error while editing image", error: err.message });
  }
};