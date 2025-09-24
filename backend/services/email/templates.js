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
    <p>Vendor Details:</p>
    <p>Name: <strong>${vendorName}</strong></p>
    <p>Shop name: <strong>${vendorShop}</strong></p>
    <p>Email: <strong>${vendorEmail}</strong></p>
  </div>
`);

// Admin Notification for Vendor Status Change Email Template
export const vendorStatusChangeAdminTemplate = (vendorName, vendorShop, vendorEmail, newStatus = "approved") => baseMail(`
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
export const productStatusTemplate = (
  productStatus,
  productName,
  productId,
  vendorName,
  vendorShop,
  statusMsg
) =>
  baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">
    Product ${toTitleCase(productStatus)}!
  </h2>

  <p style="font-size: 16px; color: #555;">
    Hello <strong>${vendorName}</strong>,  
    your product <strong>${productName}</strong> (ID: <strong>${productId}</strong>)  
    under <strong>${vendorShop}</strong> has been 
    <strong>${toTitleCase(productStatus).toLowerCase()}</strong>.
  </p>

  <p style="font-size: 14px; color: #555; margin: 15px 0;">
    ${productStatus === "approved"
      ? "🎉 Congratulations! Your product has been approved and is now live on the marketplace. Start selling right away!"
      : `❌ Unfortunately, your product has been disapproved. 
           ${statusMsg
        ? `<br><em>Reason: ${statusMsg}</em>`
        : "Please review the product details and make the necessary changes before resubmitting."
      }`
    }
  </p>

  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    Thank you for being a valued vendor! We truly appreciate your partnership.
  </p>

  <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor" 
     style="display: inline-block; padding: 10px 20px; background-color: ${productStatus === "approved" ? "#28a745" : "#dc3545"
    }; 
            color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    ${productStatus === "approved" ? "Go to Dashboard" : "Update & Resubmit"}
  </a>
`);

// Admin Notification: Vendor Resubmitted Product
export const vendorResubmittedProductTemplate = (
  productName,
  productId,
  vendorName,
  vendorShop
) =>
  baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">Vendor Resubmitted a Product for Review</h2>

  <p style="font-size: 16px; color: #555;">
    <strong>${vendorName}</strong> from <strong>${vendorShop}</strong> has resubmitted the product:
  </p>

  <p style="font-size: 14px; color: #555; margin: 10px 0;">
    <strong>Product:</strong> ${productName}<br>
    <strong>Product ID:</strong> ${productId}
  </p>

  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    The vendor has updated the product after rejection and requested a re-review.  
    Please log in to your admin dashboard to check the product details and take the next action.
  </p>

  <a href="https://multi-vendor-e-commerce.netlify.app/login/admin" 
     style="display: inline-block; padding: 10px 20px; background-color: #007bff; 
            color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Review Product
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
        <span>${change === "address" ? "Full Address" : toTitleCase(change)}:</span> <strong>${data[change]}</strong>
      </div>
    `).join("")}
    ${data.recipientName ? `
      <div style="margin-bottom: 10px; font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 5px;">
        <span>Recipient Name:</span> <strong>${data.recipientName}</strong>
      </div>
    ` : ""}
    ${data.recipientPhone ? `
      <div style="margin-bottom: 10px; font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 5px;">
        <span>Recipient Phone:</span> <strong>${data.recipientPhone}</strong>
      </div>
    ` : ""}
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

// Vendor deletion request → Admin notification
export const vendorDeletionRequestTemplate = (productName, productId, vendorName, vendorShop) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">🛑 Deletion Request Submitted</h2>
  <p style="font-size: 16px; color: #555;">
    Vendor <strong>${vendorName}</strong> from <strong>${vendorShop}</strong> has requested to delete the product:
  </p>
  <p style="font-size: 14px; color: #555; margin: 10px 0;">
    <strong>Product:</strong> ${productName}<br>
    <strong>Product ID:</strong> ${productId}
  </p>
  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    Please review this request and approve or reject the deletion.
  </p>
  <a href="https://multi-vendor-e-commerce.netlify.app/login/admin" 
     style="display: inline-block; padding: 10px 20px; background-color: #007bff; 
            color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Review Request
  </a>
`);

// Admin deletes product → Vendor notification
export const productDeletedByAdminTemplate = (productName, productId, adminName) => baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">❌ Product Deleted</h2>
  <p style="font-size: 16px; color: #555;">
    Your product <strong>${productName}</strong> (ID: <strong>${productId}</strong>) has been deleted by <strong>${adminName}</strong>.
  </p>
  <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
    If you have any questions about this action, please contact support.
  </p>
  <a href="https://multi-vendor-e-commerce.netlify.app/login/vendor" 
     style="display: inline-block; padding: 10px 20px; background-color: #dc3545; 
            color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Go to Dashboard
  </a>
`);

// Order Success Email Template
export const orderSuccessTemplate = (
  orderId,
  name,
  paymentMethod,
  totalAmount,
  items = [],
  invoiceUrl = "",
  isVendor = false,
  vendorShop = ""
) =>
  baseMail(`
  <h2 style="color: #333; margin-bottom: 20px;">
    ${isVendor ? "📦 New Order for Your Shop" : "🎉 Order Placed Successfully"}
  </h2>
  <p style="font-size: 16px; color: #555;">
    Hello <strong>${name || (isVendor ? "Vendor" : "Customer")}</strong>, 
    ${isVendor
      ? `your shop <strong>${vendorShop}</strong> has received a new order!`
      : "thank you for your order!"
    }
  </p>
  <p style="font-size: 14px; color: #555;">
    <strong>Order ID:</strong> ${orderId}<br>
    <strong>Payment Method:</strong> ${paymentMethod}<br>
    <strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}
  </p>

  <h3 style="color: #333; margin: 15px 0;">🛍️ Ordered Items:</h3>
  ${items.length > 0
      ? `
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #555;">
          <thead>
            <tr>
              <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 8px;">Product</th>
              <th style="border-bottom: 1px solid #ddd; text-align: center; padding: 8px;">Qty</th>
              <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items
        .map(
          (item) => `
            <tr>
              <td style="border-bottom: 1px solid #eee; text-align: left; padding: 8px;">
                ${item.name || "Unnamed Product"}
                ${item.discount && item.discount > 0
              ? `<br><span style="color: #e63946; font-size: 12px;">Discount: ${item.discount}%</span>`
              : ""
            }
              </td>
              <td style="border-bottom: 1px solid #eee; text-align: center; padding: 8px;">${item.qty}</td>
              <td style="border-bottom: 1px solid #eee; text-align: right; padding: 8px;">
                ₹${item.price ? item.price.toFixed(2) : "0.00"}
              </td>
            </tr>`
        )
        .join("")}
          </tbody>
        </table>
      `
      : "<p>No items found in this order.</p>"
    }

  ${invoiceUrl ? `
    <a href="${invoiceUrl}" 
      target="_blank"
      rel="noopener noreferrer"
      style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;"
    >
      View Invoice
    </a>
  ` : ""
  }

  <p style="font-size: 14px; color: #555; margin-top: 20px;">
    ${isVendor
      ? "Please prepare the items for shipment and update the order status in your dashboard."
      : "We will notify you once your order is shipped."
    }
  </p>
`);