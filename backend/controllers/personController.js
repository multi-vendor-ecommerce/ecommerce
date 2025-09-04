import Person from "../models/Person.js";
import bcrypt from "bcryptjs";
import { deleteImage } from "./imageController.js";
import Vendor from "../models/Vendor.js";

// ==========================
// Get Current Person
// ==========================
export const getCurrentPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.person.id).select("-password -__v");
    if (!person) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    res.json({ success: true, person, message: `${req.person.role}'s details loaded.` });
  } catch (err) {
    console.error("Get Person Error:", err);
    res.status(500).json({ success: false, message: "Unable to load profile. Please try again.", error: err.message });
  }
};

// ==========================
// Edit Person Profile
// ==========================
export const editPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.person.id);
    if (!person) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    const update = {};

    // Helper to set nested fields
    const setNestedValue = (obj, path, value) => {
      const keys = path.split(".");
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    };

    // Iterate over req.body keys and set them in update object
    const traverse = (obj, prefix = "") => {
      for (const key in obj) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (obj[key] !== null && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          traverse(obj[key], path);
        } else {
          setNestedValue(update, path, obj[key]);
        }
      }
    };

    traverse(req.body);

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update." });
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      req.person.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      updatedPerson,
      message: "Profile updated successfully.",
    });

  } catch (err) {
    console.error("Edit Person Error:", err);
    res.status(500).json({ success: false, message: "Unable to update profile. Please try again.", error: err.message });
  }
};

// ==========================
// Delete Person
// ==========================
export const deletePerson = async (req, res) => {
  try {
    if (req.person.role === "admin") {
      return res.status(403).json({ success: false, message: "Admin account deletion is not allowed." });
    }

    const person = await Person.findById(req.person.id);
    if (!person) {
      return res.status(404).json({ success: false, message: "Profile not found or already deleted." });
    }

    // Vendor: set status to inactive instead of deleting
    if (req.person.role === "vendor") {
      const vendor = await Vendor.findByIdAndUpdate(req.person.id, { status: "inactive" }, { new: true });
      return res.status(200).json({ success: true, vendor, message: "Vendor account disabled (inactive)." });
    }

    // Customer: delete account
    // Delete profile image if exists
    if (person.profileImageId) {
      req.body.publicId = person.profileImageId;
      req.body.type = "profile";
      req.body.targetId = req.person.id;
      await deleteImage(req, res);
    }

    await Person.findByIdAndDelete(req.person.id);
    res.status(200).json({ success: true, message: "Account deleted." });

  } catch (err) {
    console.error("Delete Person Error:", err);
    res.status(500).json({ success: false, message: "Unable to delete account. Please try again.", error: err.message });
  }
};

// ==========================
// Change Password
// ==========================
export const changePassword = async (req, res) => {
  try {
    let { currentPassword, newPassword, confirmPassword } = req.body;
    currentPassword = currentPassword?.trim();
    confirmPassword = confirmPassword?.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All password fields are required." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: "New password must be different from the current one." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New password and confirm password do not match." });
    }

    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must include letters, numbers, and a special character.",
      });
    }

    const person = await Person.findById(req.person.id);
    if (!person) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    if (!(await bcrypt.compare(currentPassword, person.password))) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    await Person.findByIdAndUpdate(
      req.person.id,
      { password: await bcrypt.hash(newPassword, 10) },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Password updated." });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ success: false, message: "Unable to update password. Please try again.", error: err.message });
  }
};