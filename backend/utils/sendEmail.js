// ==========================
// Send OTP Email Utility
// ==========================
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // or use your SMTP provider (e.g., Outlook, Zoho, Mailgun)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================
// Send OTP Email
// ==========================
export const sendOtpMail = async ({ to, otp }) => {
  const mailOptions = {
    from: `"YourApp" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <div style="padding: 20px 30px; text-align: center; border-bottom: 1px solid #eee;">
            <h2 style="margin: 0; color: #333;">🔐 Verify Your Email</h2>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p style="font-size: 16px; color: #555;">Use the code below to complete your sign in or sign up process:</p>
            <h1 style="font-size: 36px; letter-spacing: 4px; color: #2b2b2b; margin: 20px 0;">${otp}</h1>
            <p style="font-size: 14px; color: #888;">This OTP is valid for the next <strong>5 minutes</strong>. Do not share this code with anyone.</p>
          </div>
          <div style="padding: 20px 30px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee;">
            If you didn't request this, please ignore this email.
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};