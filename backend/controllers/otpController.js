// controllers/otpController.js
import otpGenerator from "otp-generator";
import Otp from "../models/Otp.js";
import Person from "../models/Person.js";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "../services/email/sender.js";

// ==========================
// Request OTP
// ==========================
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  // Basic email validation
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ success: false, message: "A valid email is required." });
  }

  const sanitizedEmail = email.trim().toLowerCase();

  const person = await Person.findOne({ email: sanitizedEmail });
  if (!person) {
    return res.status(404).json({ success: false, message: "No account found for this email." });
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  await Otp.deleteMany({ email: sanitizedEmail }); // Remove existing OTPs

  await Otp.create({ email: sanitizedEmail, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

  try {
    await sendOtpMail({ to: sanitizedEmail, otp });
    return res.status(200).json({ success: true, message: "OTP sent to your email address. Valid for 5 minutes." });
  } catch (err) {
    console.error("Email send failed:", err);
    return res.status(500).json({ success: false, message: "Unable to send OTP email. Please try again.", error: err.message });
  }
};

// ==========================
// Verify OTP
// ==========================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Basic validation
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      !otp ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp.trim())
    ) {
      return res.status(400).json({ success: false, message: "A valid email and OTP are required." });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedOtp = otp.trim();

    const otpRecord = await Otp.findOne({ email: sanitizedEmail });

    if (!otpRecord || otpRecord.otp !== sanitizedOtp || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP is invalid or has expired." });
    }

    const person = await Person.findOne({ email: sanitizedEmail });
    if (!person) {
      return res.status(404).json({ success: false, message: "No account found for this email." });
    }

    // Generate JWT
    const payload = { person: { id: person._id, role: person.role } };
    const expiresIn = person.role === "customer" ? "7d" : "6h";
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    await Otp.deleteMany({ email: sanitizedEmail }); // Clean up OTPs

    return res.status(200).json({
      success: true,
      message: "OTP verified. You are now logged in.",
      data: { authToken, role: person.role }
    });
  } catch (err) {
    console.error("OTP verification failed:", err);
    return res.status(500).json({ success: false, message: "Unable to verify OTP. Please try again.", error: err.message });
  }
};