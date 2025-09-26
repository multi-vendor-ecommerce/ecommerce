import cloudinary from "../config/cloudinary.js";

/**
 * Deletes an array of images from Cloudinary.
 * @param {Array} images - Array of image objects with public_id.
 * @returns {Promise<void>}
 */
export async function deleteCloudinaryImages(images = []) {
  if (!Array.isArray(images)) return;
  for (const img of images) {
    if (img.public_id) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", img.public_id, err);
      }
    }
  }
}