import { sendMail } from "./sendMail.js";
import { otpTemplate, productAddedTemplate, productAddedAdminTemplate, approveVendorTemplate, approveProductTemplate } from "./templates.js";

export const sendOtpMail = async ({ to, otp }) => {
  await sendMail({
    to,
    subject: "🔐 Your OTP Code",
    html: otpTemplate(otp),
  });
};

export const sendProductAddedMail = async ({ to, productName }) => {
  await sendMail({
    to,
    subject: "✅ Product Submitted",
    html: productAddedTemplate(productName),
  });
};

export async function sendProductAddedAdminMail({ to, vendorName, vendorEmail, productName }) {
  await sendMail({
    to,
    subject: "New Product Added by Vendor",
    html: productAddedAdminTemplate(productName, vendorName, vendorEmail),
  });
}

export async function sendApproveVendorMail({ to, vendorName }) {
  await sendMail({
    to,
    subject: "✅ Vendor Account Approved",
    html: approveVendorTemplate(vendorName),
  });
}

export async function sendApproveProductMail({ to, product }) {
  await sendMail({
    to,
    subject: "✅ Product Approved",
    html: approveProductTemplate(product),
  });
}