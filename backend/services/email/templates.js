// services/email/otpEmail.js
import { baseMail } from "./baseMail.js";

export const otpTemplate = (otp) => baseMail(`
  <p style="font-size: 16px; color: #555;">
    Use the code below to complete your sign in or sign up process:
  </p>
  <h1 style="font-size: 36px; letter-spacing: 4px; color: #2b2b2b; margin: 20px 0;">${otp}</h1>
  <p style="font-size: 14px; color: #888;">
    This OTP is valid for the next <strong>5 minutes</strong>. Do not share this code with anyone.
  </p>

  <div style="padding: 20px 30px; text-align: center; font-size: 12px; color: #aaa;">
    If you didn't request this email, you can safely ignore it.
  </div>
`);

export const productAddedTemplate = (productName) => baseMail(`
  <p style="font-size: 16px; color: #555;">
    Your product <strong>${productName}</strong> has been successfully submitted.
  </p>
  <p style="font-size: 14px; color: #888;">
    It is currently under review and will be approved by an admin soon.
  </p>
`);

export const productAddedAdminTemplate = (productName, vendorName, vendorEmail) => baseMail(`
  <p style="font-size: 16px; color: #555;">
    A new product <strong>${productName}</strong> has been added.
    Vendor: <strong>${vendorName}</strong> (${vendorEmail})
  </p>
`);

export const approveVendorTemplate = (vendorName) => baseMail(`
  <p style="font-size: 16px; color: #555;">
    Congratulations <strong>${vendorName}</strong>, your vendor account has been approved!
    You can now start adding products to the marketplace.
    Login at <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor" style="color: #1a73e8; text-decoration: underline;">here</a>
  </p>
`);

export const approveProductTemplate = (product) => baseMail(`
  <p style="font-size: 16px; color: #555;">
    Congratulations <strong>${product.title}</strong>, with id: <strong>${product._id}</strong> your product has been approved!
    You can now start selling it on the marketplace.
    Login at <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor" style="color: #1a73e8; text-decoration: underline;">here</a>
  </p>
`);