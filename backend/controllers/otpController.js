// controllers/otpController.js
import otpGenerator from "otp-generator";
import Otp from "../models/Otp.js";
import Person from "../models/Person.js";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "../utils/sendEmail.js";

// 1. Request OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, error: "Email is required." });

  const person = await Person.findOne({ email });
  if (!person) return res.status(404).json({ success: false, error: "User not found." });

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  await Otp.deleteMany({ email }); // remove existing OTPs

  await Otp.create({ email, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

  // ✅ Send email
  try {
    await sendOtpMail({ to: email, otp });
    return res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error("Email send failed:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP email.", error: err.message });
  }
};

// 2. Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ success: false, error: "Email and OTP are required." });

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, error: "Invalid or expired OTP." });
    }

    const person = await Person.findOne({ email });
    if (!person) return res.status(404).json({ success: false, error: "User not found." });

    // Generate JWT
    const payload = { person: { id: person._id, role: person.role } };
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    await Otp.deleteMany({ email }); // clean up

    return res.status(200).json({ success: true, message: "OTP verified. Login successful.", data: { authToken, role: person.role } });
  } catch (error) {
    console.error("Email send failed:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP email.", error: err.message });
  }
};
