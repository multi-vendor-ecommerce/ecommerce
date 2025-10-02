import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

/**
 * Save customer invoice PDF to Cloudinary
 * @param {Buffer|ArrayBuffer} buffer - PDF data
 * @param {string} invoiceNumber - File name
 * @returns {Promise<string>} - Secure URL of uploaded invoice
 */
export async function saveInvoice(buffer, invoiceNumber) {
  if (!buffer || buffer.byteLength === 0) {
    throw new Error("Invoice buffer is empty, cannot upload");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "invoices/customers",
        public_id: invoiceNumber,
        resource_type: "raw",
        format: "pdf",
        overwrite: true,
        type: "upload",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }
        console.log("✅ Customer invoice uploaded:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(Buffer.from(buffer)).pipe(uploadStream);
  });
}