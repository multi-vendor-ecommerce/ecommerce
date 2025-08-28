import cloudinary from "../config/cloudinary.js";
import Person from "../models/Person.js";
import Product from "../models/Products.js";
import Vendor from "../models/Vendor.js";

// ==========================
// DELETE IMAGE - Remove an image from Cloudinary + DB
// ==========================
export const deleteImage = async (req, res) => {
  try {
    const { publicId, type, targetId } = req.body;
    // type = "profile" | "product" | "shopLogo"

    if (!publicId || !type || !targetId) {
      return res.status(400).json({ success: false, message: "Missing required image information." });
    }

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Update DB
    if (type === "profile") {
      await Person.findByIdAndUpdate(targetId, { $set: { profileImage: "", profileImageId: "" } });
    }
    if (type === "product") {
      await Product.findByIdAndUpdate(targetId, { $pull: { images: { public_id: publicId } } });
    }
    if (type === "shopLogo") {
      await Vendor.findByIdAndUpdate(targetId, { $set: { shopLogo: "", shopLogoId: "" } });
    }

    res.status(200).json({ success: true, message: "Image deleted." });
  } catch (err) {
    console.error("Delete Image Error:", err);
    res.status(500).json({ success: false, message: "Could not delete image.", error: err.message });
  }
};

// ==========================
//  EDIT IMAGE - Replace an image in Cloudinary + DB
// ==========================
export const editImage = async (req, res) => {
  try {
    const { oldPublicId, type, targetId } = req.body;
    // req.file contains new image (via multer)

    if (!req.file || !type || !targetId) {
      return res.status(400).json({ success: false, message: "Missing required image information." });
    }

    // Delete old image from Cloudinary
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: type === "profile" ? "profiles" : type === "shopLogo" ? "shopLogos" : "products",
    });

    // Update DB
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
    if (type === "shopLogo") {
      await Vendor.findByIdAndUpdate(
        targetId,
        { $set: { shopLogo: result.secure_url, shopLogoId: result.public_id } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Image updated.",
      newImage: { url: result.secure_url, public_id: result.public_id }
    });
  } catch (err) {
    console.error("Edit Image Error:", err);
    res.status(500).json({ success: false, message: "Could not update image.", error: err.message });
  }
};