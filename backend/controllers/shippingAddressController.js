// controllers/shippingAddressController.js
import ShippingAddress from "../models/ShippingAddress.js";

// Get all addresses for a user
export const getAddresses = async (req, res) => {
  try {
    const addresses = await ShippingAddress.find({ customer: req.person.id });

    res.status(200).json({
      success: true,
      message: addresses.length > 0
        ? "Addresses fetched successfully"
        : "No addresses found",
      addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching addresses", error: error.message });
  }
};

// Get single address by ID
export const getAddressById = async (req, res) => {
  try {
    const customerId = req.person.id;
    const { id } = req.params;

    const address = await ShippingAddress.findById(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (address.customer.toString() !== customerId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, message: "Address fetched successfully", address });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching address", error: error.message });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  const customerId = req.person.id;
  const { recipientName, recipientPhone, line1, line2, locality, city, state, country, pincode, geoLocation } = req.body;

  try {
    // Check max 3 addresses
    const count = await ShippingAddress.countDocuments({ customer: customerId });
    if (count >= 3) {
      return res.status(400).json({ success: false, message: "You can only save up to 3 addresses." });
    }

    // If first address, set as default
    const isDefault = count === 0;

    const newAddress = await ShippingAddress.create({
      customer: customerId, recipientName, recipientPhone, line1, line2,
      locality, city, state, country, pincode, geoLocation, isDefault,
    });

    res.status(201).json({ success: true, message: "Address added successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding address", error: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const customerId = req.person.id;
    const { id } = req.params;

    const updatedData = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    let address = await ShippingAddress.findById(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (address.customer.toString() !== customerId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    address = await ShippingAddress.findByIdAndUpdate(
      { _id: id, customer: customerId },
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Address updated successfully", address });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating address", error: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const customerId = req.person.id;
    const { id } = req.params;

    let address = await ShippingAddress.findById(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    if (address.customer.toString() !== customerId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    await ShippingAddress.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting address", error: error.message });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const customerId = req.person.id;
    const { id } = req.params;

    let address = await ShippingAddress.findById(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (address.customer.toString() !== customerId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    await ShippingAddress.updateMany({ customer: customerId }, { $set: { isDefault: false } });
    address = await ShippingAddress.findByIdAndUpdate(id, { $set: { isDefault: true } }, { new: true });

    res.status(200).json({ success: true, message: "Default address set successfully", address });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error setting default address", error: error.message });
  }
};