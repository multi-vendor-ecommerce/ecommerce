import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

export async function saveInvoice(buffer, invoiceNumber, mode = "customer") {
  if (!buffer || buffer.byteLength === 0) {
    throw new Error("Invoice buffer is empty, cannot upload");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: mode === "customer" ? "invoices/customers" : "invoices/vendors",
        public_id: invoiceNumber,
        resource_type: "raw",
        format: "pdf",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }
        console.log("✅ Invoice uploaded:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(Buffer.from(buffer)).pipe(uploadStream);
  });
}