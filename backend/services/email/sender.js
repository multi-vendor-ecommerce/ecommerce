import { toTitleCase } from "../../utils/titleCase.js";
import { sendMail } from "./sendMail.js";
import { 
  otpTemplate, 
  productAddedTemplate, 
  productAddedAdminTemplate, 
  approveVendorTemplate, 
  approveProductTemplate,
  disapproveProductTemplate
} from "./templates.js";

export const sendOtpMail = async ({ to, otp }) => {
  await sendMail({
    to,
    subject: "Your OTP Code",
    html: otpTemplate(otp),
  });
};

export const sendProductAddedMail = async ({ to, productName, productId }) => {
  await sendMail({
    to,
    subject: "Product Submitted",
    html: productAddedTemplate(productName, productId),
  });
};

export async function sendProductAddedAdminMail({ to, vendorName, vendorEmail, productName }) {
  await sendMail({
    to,
    subject: "New Product Added by Vendor",
    html: productAddedAdminTemplate(productName, vendorName, vendorShop, vendorEmail),
  });
}

export async function sendApproveVendorMail({ to, vendorName, vendorShop }) {
  await sendMail({
    to,
    subject: "Your Vendor Account Approved",
    html: approveVendorTemplate(vendorName, vendorShop),
  });
}

export async function sendProductStatusMail({ to, productStatus, productName, productId }) {
  await sendMail({
    to,
    subject: `Your Product ${toTitleCase(productStatus)}`,
    html: productStatus === "approved"
      ? approveProductTemplate(productName, productId)
      : disapproveProductTemplate(productName, productId),
  });
}