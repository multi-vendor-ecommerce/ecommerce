import Person from "../models/Person.js";
import bcrypt from "bcryptjs";
import { deleteImage, editImage } from "./imageController.js"; // Import your image controller

export const getCurrentPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.person.id).select("-password");
    res.json({ success: true, person, message: `${req.person.role}'s details fetched successfully.` })
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: 'Interal Server Error', error: err.message });
  }
}

export const editPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.person.id);
    if (!person) {
      return res.status(404).json({ success: false, message: "Person not found" });
    }

    const allowedFields = [
      "name", "phone",
      "address.line1", "address.line2", "address.city",
      "address.state", "address.country", "address.pincode",
      "address.locality", "address.recipientName", "address.recipientPhone",
      "address.geoLocation.lat", "address.geoLocation.lng"
    ];

    const update = {};

    // ✅ Handle nested fields
    const setNestedValue = (obj, path, value) => {
      const keys = path.split(".");
      let current = obj;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
    };

    for (const field of allowedFields) {
      const keys = field.split(".");
      let value = req.body;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }
      if (value === undefined && req.body[field] !== undefined) {
        value = req.body[field];
      }
      if (value !== undefined) {
        setNestedValue(update, field, value);
      }
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      req.person.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      updatedPerson,
      message: "Profile updated successfully."
    });

  } catch (err) {
    console.error("Edit Person Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: err.message
    });
  }
};

// Controller: deletePerson
export const deletePerson = async (req, res) => {
  try {
    if (req.person.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin account deletion not allowed here." });
    }

    const person = await Person.findById(req.person.id);
    if (!person) {
      return res
        .status(404)
        .json({ success: false, message: "Person not found or already deleted" });
    }

    // ✅ Use imageController for profile image delete
    if (person.profileImageId) {
      // Call deleteImage controller logic directly
      req.body.publicId = person.profileImageId;
      req.body.type = "profile";
      req.body.targetId = req.person.id;
      
      await deleteImage(req, res);
      // Note: deleteImage sends the response, so you may want to delete the person after image deletion
      // If you want to send a single response, you can move the DB deletion logic into deleteImage or handle here after image deletion
      await Person.findByIdAndDelete(req.person.id);
      return res
        .status(200)
        .json({ success: true, message: "User account deleted successfully." });
    }

    await Person.findByIdAndDelete(req.person.id);

    res
      .status(200)
      .json({ success: true, message: "User account deleted successfully." });

  } catch (err) {
    console.error("Error deleting person:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Controller: changePassword (unchanged)
export const changePassword = async (req, res) => {
  try {
    let { currentPassword, newPassword, confirmPassword } = req.body;
    currentPassword = currentPassword.trim();
    confirmPassword = confirmPassword.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from the current one" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must include letters, numbers, and at least one special character.",
      });
    }

    const person = await Person.findById(req.person.id);
    if (!person) {
      return res.status(404).json({ message: `${req.person.role} not found` });
    }

    if (!(await bcrypt.compare(currentPassword, person.password))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    await Person.findByIdAndUpdate(
      req.person.id,
      { password: await bcrypt.hash(newPassword, 10) },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};