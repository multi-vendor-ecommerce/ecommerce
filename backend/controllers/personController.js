import Person from "../models/Person.js";

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
      let value = req.body;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
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

    res.status(200).json({ success: true, updatedPerson, message: `${req.person.role}'s profile updated successfully.` });
  } catch (err) {
    console.error("Edit Person Error:", err);
    res.status(500).json({ success: false, message: "Server error while updating profile", error: err.message });
  }
};