// services/email/otpEmail.js
import { baseMail } from "./baseMail.js";

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
    If you didn’t request this code, please ignore this email.
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

// Vendor Account Approval Email Template
export const approveVendorTemplate = (vendorName, vendorShop) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">✅ Vendor Account Approved</h2>
  <p style="font-size: 16px; color: #555;">
    Congratulations <strong>${vendorName}</strong>, your vendor account has been approved!
  </p>
  <p style="font-size: 14px; color: #555; margin: 15px 0;">
    Shop Name: <strong>${vendorShop}</strong>
  </p>
  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    You can now start adding products to the marketplace.
  </p>
  <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor" 
     style="display: inline-block; padding: 10px 20px; background-color: #1a73e8; 
            color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Login to Your Dashboard
  </a>
`);

// Vendor Account Disapproval Email Template
export const disapproveVendorTemplate = (vendorName, vendorShop) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">❌ Vendor Account Disapproved</h2>
  <p style="font-size: 16px; color: #555;">
    Hello, <strong>${vendorName}</strong>. We're sorry to inform you that your vendor account has been disapproved.
  </p>
  <p style="font-size: 14px; color: #555; margin: 15px 0;">
    Shop Name: <strong>${vendorShop}</strong>
  </p>
  <p style="font-size: 14px; color: #555; margin: 15px 0;">
    Reasons: <strong>Shop does not meet the quality standards.</strong>
  </p>
  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    You can contact our support team for more information,
    <a href="mailto:support@noahplanet.com" style="color: #1a73e8; text-decoration: underline;">here</a>.
  </p>
`);

// Vendor Product Approval Notification Email Template
export const approveProductTemplate = (productName, productId, vendorName, vendorShop) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">🎉 Product Approved</h2>
  <p style="font-size: 16px; color: #555;">
    Great news! Hello <strong>${vendorName}</strong>, Your product <strong>${productName}</strong> (ID: <strong>${productId}</strong>) 
    has been approved under <strong>${vendorShop}</strong>.
  </p>
  <p style="font-size: 14px; color: #555; margin: 15px 0;">
    You can now start selling it on the marketplace.
  </p>
  <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor" 
     style="display: inline-block; padding: 10px 20px; background-color: #28a745; 
            color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Go to Dashboard
  </a>
`);

// Vendor Product Rejection Notification Email Template
export const disapproveProductTemplate = (productName, productId, vendorName, vendorShop) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">❌ Product Rejected</h2>
  <p style="font-size: 16px; color: #555;">
    Hello <strong>${vendorName}</strong>, We're sorry to inform you that your product <strong>${productName}</strong> (ID: <strong>${productId}</strong>) 
    has been rejected under <strong>${vendorShop}</strong>.
  </p>
  <p style="font-size: 14px; color: #555; margin: 15px 0;">
    Reasons: <strong>Product does not meet the quality standards.</strong>
  </p>
  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    You can edit your product details and resubmit it for approval.
  </p>
  <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor" 
     style="display: inline-block; padding: 10px 20px; background-color: #28a745; 
            color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Go to Dashboard
  </a>
`);