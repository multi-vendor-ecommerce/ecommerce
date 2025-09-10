import { toTitleCase } from "../../utils/titleCase.js";
import { sendMail } from "./sendMail.js";
import { 
  otpTemplate, 
  productAddedTemplate, 
  productAddedAdminTemplate, 
  vendorStatusTemplate,
  productStatusTemplate,
  vendorProfileUpdatedTemplate,
  vendorStatusChangeAdminTemplate,
  vendorResubmittedProductTemplate,
  vendorDeletionRequestTemplate,
  productDeletedByAdminTemplate,
  orderSuccessTemplate
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

export async function sendProductStatusMail({ to, productStatus, productName, productId, vendorName, vendorShop, statusMsg = "" }) {
  await sendMail({
    to,
    subject: `Your Product Status Update: ${toTitleCase(productStatus)}`,
    html: productStatusTemplate(productStatus, productName, productId, vendorName, vendorShop, statusMsg),
  });
}

export async function sendVendorResubmittedProductMail({ to, productName, productId, vendorName, vendorShop }) {
  await sendMail({
    to,
    subject: "Vendor Resubmitted Product for Review",
    html: vendorResubmittedProductTemplate(productName, productId, vendorName, vendorShop),
  });
}

export async function sendVendorStatusMail({ to, vendorName, vendorShop, vendorEmail }) {
  await sendMail({
    to,
    subject: `Vendor Status Approval`,
    html: vendorStatusChangeAdminTemplate(vendorName, vendorShop, vendorEmail, "approved"),
  });
}

export async function sendVendorApprovalStatusMail({ to, vendorStatus, vendorName, vendorShop, reason = "" }) {
  await sendMail({
    to,
    subject: `Your Vendor Account Status Update: ${toTitleCase(vendorStatus)}`,
    html: vendorStatusTemplate(vendorName, vendorShop, vendorStatus, reason),
  });
}

export async function sendVendorProfileUpdatedMail({ to, vendorName, vendorShop, changes, data }) {
  await sendMail({
    to,
    subject: `Your Vendor Profile Has Been Updated by Admin`,
    html: vendorProfileUpdatedTemplate(vendorName, vendorShop, changes, data),
  });
}

// Vendor requests product deletion → notify admin
export async function sendVendorDeletionRequestMail({ to, productName, productId, vendorName, vendorShop }) {
  await sendMail({
    to,
    subject: `Deletion Request for Product: ${productName}`,
    html: vendorDeletionRequestTemplate(productName, productId, vendorName, vendorShop),
  });
}

// Admin deletes product → notify vendor
export async function sendProductDeletedByAdminMail({ to, productName, productId, adminName }) {
  await sendMail({
    to,
    subject: `Your Product Has Been Deleted by Admin: ${productName}`,
    html: productDeletedByAdminTemplate(productName, productId, adminName),
  });
}

// Order success mail to customer
export async function sendOrderSuccessMail({ to, orderId, customerName, paymentMethod, totalAmount, items }) {
  await sendMail({
    to,
    subject: "Your Order Has Been Placed Successfully!",
    html: orderSuccessTemplate(orderId, customerName, paymentMethod, totalAmount, items),
  });
}