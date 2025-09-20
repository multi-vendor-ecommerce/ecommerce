import otpGenerator from "otp-generator";
import Otp from "../models/Otp.js";
import Person from "../models/Person.js";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "../services/email/sender.js";

// ==========================
// Request OTP
// ==========================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "A valid email is required." });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const person = await Person.findOne({ email: sanitizedEmail });
    if (!person) {
      return res.status(404).json({ success: false, message: "No account found for this email." });
    }

    // Generate OTP with numbers, letters, special chars
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: true,
      upperCaseAlphabets: true,
      specialChars: true,
    });

    // Remove any existing OTPs for this email
    await Otp.deleteMany({ email: sanitizedEmail });

    // Save new OTP (TTL handles expiry)
    await Otp.create({ email: sanitizedEmail, otp });

    // Send OTP via email
    await sendOtpMail({ to: sanitizedEmail, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email address. Valid for 5 minutes.",
    });
  } catch (err) {
    console.error("OTP send failed:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to send OTP email. Please try again.",
      error: err.message,
    });
  }
};

// ==========================
// Verify OTP
// ==========================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Sanitize inputs
    const sanitizedEmail = (email || "").toString().trim().toLowerCase();
    const sanitizedOtp = (otp || "").toString().trim();

    // Validate
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail) || sanitizedOtp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "A valid email and 6-character OTP are required.",
      });
    }

    // Find OTP record
    const otpRecord = await Otp.findOne({ email: sanitizedEmail, otp: sanitizedOtp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP is invalid or has expired." });
    }

    // Check user
    const person = await Person.findOne({ email: sanitizedEmail });
    if (!person) {
      return res.status(404).json({ success: false, message: "No account found for this email." });
    }

    // Generate JWT
    const payload = { person: { id: person._id, role: person.role } };
    const expiresIn = person.role === "customer" ? "7d" : "6h";
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    // Clean up OTPs
    await Otp.deleteMany({ email: sanitizedEmail });

    return res.status(200).json({
      success: true,
      message: "OTP verified. You are now logged in.",
      data: { authToken, role: person.role },
    });
  } catch (err) {
    console.error("OTP verification failed:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP. Please try again.",
      error: err.message,
    });
  }
};