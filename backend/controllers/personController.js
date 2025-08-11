import Person from "../models/Person.js";
import bcrypt from "bcryptjs";

export const getCurrentPerson = async (req, res) => {
  try {
    // Fetch the user's details except password using the id
    const person = await Person.findById(req.person.id).select("-password");
    res.json({ success: true, person, message: `${req.person.role}'s details fetched successfully.` })
  } catch (err) {
    // Catch the error
    console.log(err.message);
    res.status(500).json({ success: false, error: 'Interal Server Error', message: err.message });
  }
}

export const editPerson = async (req, res) => {
  try {
    // Only allow updatable fields
    const allowedFields = [
      "name", "profileImage", "phone",
      "address.line1", "address.line2", "address.city",
      "address.state", "address.country", "address.pincode",
      "address.locality", "address.recipientName", "address.recipientPhone",
      "address.geoLocation.lat", "address.geoLocation.lng"
    ];

    const update = {};

    // 1. Handle uploaded image
    if (req.file && req.file.path) {
      update.profileImage = req.file.path;
    }

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

      // Check nested form
      let value = req.body;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }

      // If nested value not found, check flattened field name
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

    res.status(200).json({ success: true, updatedPerson, message: "Profile updated successfully." });
  } catch (err) {
    console.error("Edit Person Error:", err);
    res.status(500).json({ success: false, message: "Server error while updating profile", error: err.message });
  }
};

// Controller: deletePerson
export const deletePerson = async (req, res) => {
  try {
    // req.person contains the logged-in user's data from verifyToken middleware
    if (req.person.role === "admin") {
      return res.status(403).json({ success: false, message: "Admin account deletion not allowed here." });
    }

    // Assuming you have a Person model
    const deleted = await Person.findByIdAndDelete(req.person.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Person not found or already deleted" });
    }

    res.status(200).json({ success: true, message: "User account deleted successfully." });
  } catch (err) {
    console.error("Error deleting person:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Controller: changePassword
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

    // Validate new password strength
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must include letters, numbers, and at least one special character.",
      });
    }

    // Find user
    const person = await Person.findById(req.person.id);
    if (!person) {
      return res.status(404).json({ message: `${req.person.role} not found` });
    }

    // Check current password
    if (!(await bcrypt.compare(currentPassword, person.password))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password
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