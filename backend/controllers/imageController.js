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

    if (!publicId || !type || !targetId) {
      return res.status(400).json({ success: false, message: "Missing required image information." });
    }

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Update DB
    switch (type) {
      case "profile":
        await Person.findByIdAndUpdate(targetId, { $set: { profileImage: "", profileImageId: "" } });
        break;
      case "product":
        await Product.findByIdAndUpdate(targetId, { $pull: { images: { public_id: publicId } } });
        break;
      case "shopLogo":
        await Vendor.findByIdAndUpdate(targetId, { $set: { shopLogo: "", shopLogoId: "" } });
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid image type." });
    }

    res.status(200).json({ success: true, message: "Image deleted." });
  } catch (err) {
    console.error("Delete Image Error:", err);
    res.status(500).json({ success: false, message: "Could not delete image.", error: err.message });
  }
};

// ==========================
// EDIT IMAGE - Replace an image in Cloudinary + DB
// ==========================
export const editImage = async (req, res) => {
  try {
    const { oldPublicId, type, targetId } = req.body;

    if (!req.file || !type || !targetId) {
      return res.status(400).json({ success: false, message: "Missing required image information." });
    }

    // Delete old image from Cloudinary
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    // Determine folder strictly by type
    let folderName;
    switch (type) {
      case "profile":
        folderName = "profiles";
        break;
      case "shopLogo":
        folderName = "shopLogos";
        break;
      case "product":
        folderName = "products";
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid image type." });
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
      public_id: req.body.publicId || undefined, // reuse old publicId if provided
    });

    // Update DB
    switch (type) {
      case "profile":
        await Person.findByIdAndUpdate(
          targetId,
          { $set: { profileImage: result.secure_url, profileImageId: result.public_id } },
          { new: true }
        );
        break;
      case "product":
        await Product.findOneAndUpdate(
          { _id: targetId, "images.public_id": oldPublicId },
          { $set: { "images.$": { url: result.secure_url, public_id: result.public_id } } },
          { new: true }
        );
        break;
      case "shopLogo":
        await Vendor.findByIdAndUpdate(
          targetId,
          { $set: { shopLogo: result.secure_url, shopLogoId: result.public_id } },
          { new: true }
        );
        break;
    }

    res.status(200).json({
      success: true,
      message: "Image updated successfully.",
      newImage: { url: result.secure_url, public_id: result.public_id }
    });
  } catch (err) {
    console.error("Edit Image Error:", err);
    res.status(500).json({ success: false, message: "Could not update image.", error: err.message });
  }
};