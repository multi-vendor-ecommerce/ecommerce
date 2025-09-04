// services/email/otpEmail.js
import { baseMail } from "./baseMail.js";
import { toTitleCase } from "../../utils/titleCase.js";

// OTP Verification Email Template
export const otpTemplate = (otp) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">🔐 Email Verification</h2>
  <p style="font-size: 16px; color: #555; margin-bottom: 10px;">
    Please use the following one-time password (OTP) to continue:
  </p>
  <h1 style="font-size: 40px; font-weight: bold; letter-spacing: 6px; color: #2b2b2b; margin: 20px 0;">
    ${otp}
  </h1>
  <p style="font-size: 14px; color: #888; margin-bottom: 20px;">
    This OTP is valid for the next <strong>5 minutes</strong>. Do not share this code with anyone.
  </p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
  <p style="font-size: 12px; color: #aaa;">
    If you didn't request this code, please ignore this email.
  </p>
`);

// Vendor Product Submission Confirmation Email Template
export const productAddedTemplate = (productName, productId) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">📦 Product Submitted</h2>
  <p style="font-size: 16px; color: #555;">
    Your product <strong>${productName}</strong> with ID <strong>${productId}</strong> has been successfully submitted.
  </p>
  <p style="font-size: 14px; color: #888; margin-top: 10px;">
    It is currently under review and will be approved by an admin shortly.
  </p>
`);

// Admin Notification for New Product Submission Email Template
export const productAddedAdminTemplate = (productName, vendorName, vendorShop, vendorEmail) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">🛒 New Product Added</h2>
  <p style="font-size: 16px; color: #555;">
    A new product <strong>${productName}</strong> has been submitted to the marketplace.
  </p>
  <div style="display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: #888; margin-top: 10px;">
    <span>Vendor Details:</span>
    <span>Name: <strong>${vendorName}</strong></span>
    <span>Shop name: <strong>${vendorShop}</strong></span>
    <span>Email: <strong>${vendorEmail}</strong></span>
  </div>
`);

// Admin Notification for Vendor Status Change Email Template
export const vendorStatusChangeAdminTemplate = (vendorName, vendorShop, vendorEmail, newStatus="approved") => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">🏷️ Vendor Status Updated</h2>
  <p style="font-size: 16px; color: #555;">
    Vendor <strong>${vendorName}</strong> has been inactive and has requested to change their status to <strong>${newStatus}</strong>.
  </p>
  <div style="font-size: 14px; color: #888; margin-top: 10px;">
    <span style="display: block; margin-bottom: 6px;">Vendor Details:</span>
    <span style="display: block; margin-bottom: 6px;">Shop name: <strong>${vendorShop}</strong></span>
    <span style="display: block;">Email: <strong>${vendorEmail}</strong></span>
  </div>
`);

// Vendor Account Status Change Notification Email Template
export const vendorStatusTemplate = (vendorName, vendorShop, vendorStatus, reason = "") => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">🏷️ Account Status Updated</h2>
  <p style="font-size: 16px; color: #555;">
    Hello <strong>${vendorName}</strong>, your vendor account for <strong>${vendorShop}</strong> has had its status changed to <strong>${vendorStatus}</strong> by <strong>Admin</strong>.
  </p>
  ${vendorStatus !== "active" && reason ? `<p style="font-size: 14px; color: #555; margin: 15px 0;">
    <strong>Reason:</strong> ${reason}
  </p>` : ""}
  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    ${vendorStatus === "active" ?
      "You can now log in and start managing your products."
      :
      "If you have questions about this change, please contact support."
    }
  </p>
  <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor"
      style="display: inline-block; padding: 10px 20px; background-color: #28a745;
              color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Go to Dashboard
  </a>
  <p style="font-size: 14px; color: #555; margin-top: 20px;">
    Thank you for being a valued vendor! We appreciate your partnership.
  </p>
`);

// Vendor Product Approval/Disapproval Notification Email Template
export const productStatusTemplate = (productStatus, productName, productId, vendorName, vendorShop) => baseMail(`
  < h2 style = "color: #333; margin-bottom: 20px;" > Product ${ toTitleCase(productStatus) } !</ >
  <p style="font-size: 16px; color: #555;">
    Hello <strong>${vendorName}</strong>, your product <strong>${productName}</strong> (ID: <strong>${productId}</strong>) 
    under <strong>${vendorShop}</strong> has been <strong>${productStatus}</strong>.
  </p>
  <p style="font-size: 14px; color: #555; margin: 15px 0;">
    ${productStatus === "approved" ?
      "You can now start selling this product on the marketplace."
      :
      "Please review the product details and make necessary adjustments."
    }
  </p>
  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    Thank you for being a valued vendor! We appreciate your partnership.
  </p>
  <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor" 
     style="display: inline-block; padding: 10px 20px; background-color: #28a745; 
            color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Go to Dashboard
  </a>
`);

// Vendor Profile Updated Notification Email Template (uses <div> and <p> for changes)
export const vendorProfileUpdatedTemplate = (vendorName, vendorShop, changes, data) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">🛠️ Vendor Profile Updated</h2>
  <p style="font-size: 16px; color: #555;">
    Hello <strong>${vendorName}</strong>, your vendor profile for <strong>${vendorShop}</strong> has been updated by <strong>Admin</strong>.
  </p>
  <p style="font-size: 14px; color: #555; margin: 5px 0;">
    <strong>Changes made:</strong>
  </p>
  <div style="margin-bottom: 20px;">
    ${changes.map(change => `
      <div style="margin-bottom: 10px; font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 5px;">
        <span>${toTitleCase(change)}:</span> <strong>${data[change]}</strong>
      </div>
    `).join("")}
  </div>
  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    Check your profile for the latest updates.
  </p>
  <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor" 
    style="display: inline-block; padding: 10px 20px; background-color: #28a745; 
          color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Go to Dashboard
  </a>
  <p style="font-size: 14px; color: #555; margin-top: 20px;">
    Thank you for being a valued vendor! We appreciate your partnership.
  </p>
`);