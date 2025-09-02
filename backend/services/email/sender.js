import { toTitleCase } from "../../utils/titleCase.js";
import { sendMail } from "./sendMail.js";
import { 
  otpTemplate, 
  productAddedTemplate, 
  productAddedAdminTemplate, 
  approveVendorTemplate, 
  disapproveVendorTemplate,
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

export async function sendVendorStatusMail({ to, vendorStatus, vendorName, vendorShop }) {
  await sendMail({
    to,
    subject: `Your Vendor Account Status Update: ${toTitleCase(vendorStatus)}`,
    html: vendorStatus === "approved"
      ? approveVendorTemplate(vendorName, vendorShop)
      : disapproveVendorTemplate(vendorName, vendorShop),
  });
}

export async function sendProductStatusMail({ to, productStatus, productName, productId, vendorName, vendorShop }) {
  await sendMail({
    to,
    subject: `Your Product Status Update: ${toTitleCase(productStatus)}`,
    html: productStatus === "approved"
      ? approveProductTemplate(productName, productId, vendorName, vendorShop)
      : disapproveProductTemplate(productName, productId, vendorName, vendorShop),
  });
}