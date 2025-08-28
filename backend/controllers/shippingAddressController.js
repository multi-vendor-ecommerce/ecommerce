// controllers/shippingAddressController.js
import ShippingAddress from "../models/ShippingAddress.js";
import mongoose from "mongoose";

// ==========================
// Get all addresses for a user
// ==========================
export const getAddresses = async (req, res) => {
  try {
    const addresses = await ShippingAddress.find({ customer: req.person.id });

    res.status(200).json({
      success: true,
      message: addresses.length > 0
        ? "Addresses loaded."
        : "No addresses found for your account.",
      addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load addresses.", error: error.message });
  }
};

// ==========================
// Get single address by ID
// ==========================
export const getAddressById = async (req, res) => {
  try {
    const customerId = req.person.id;
    const { id } = req.params;

    // Validate address ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid address information." });
    }

    const address = await ShippingAddress.findById(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    if (address.customer.toString() !== customerId) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({
      success: true,
      message: "Address loaded.",
      address
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load address.", error: error.message });
  }
};

// ==========================
// Add new address
// ==========================
export const addAddress = async (req, res) => {
  const customerId = req.person.id;
  const { recipientName, recipientPhone, line1, line2, locality, city, state, country, pincode, geoLocation } = req.body;

  try {
    // Limit to 3 addresses per user
    const count = await ShippingAddress.countDocuments({ customer: customerId });
    if (count >= 3) {
      return res.status(400).json({ success: false, message: "Maximum 3 addresses allowed." });
    }

    // If first address, set as default
    const isDefault = count === 0;

    const newAddress = await ShippingAddress.create({
      customer: customerId, recipientName, recipientPhone, line1, line2,
      locality, city, state, country, pincode, geoLocation, isDefault,
    });

    res.status(201).json({
      success: true,
      message: "Address added.",
      address: newAddress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to add address.", error: error.message });
  }
};

// ==========================
// Update address
// ==========================
export const updateAddress = async (req, res) => {
  try {
    const customerId = req.person.id;
    const { id } = req.params;

    // Validate address ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid address information." });
    }

    const updatedData = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update." });
    }

    let address = await ShippingAddress.findById(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    if (address.customer.toString() !== customerId) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    address = await ShippingAddress.findByIdAndUpdate(
      { _id: id, customer: customerId },
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated.",
      address
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to update address.", error: error.message });
  }
};

// ==========================
// Delete address
// ==========================
export const deleteAddress = async (req, res) => {
  try {
    const customerId = req.person.id;
    const { id } = req.params;

    // Validate address ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid address information." });
    }

    let address = await ShippingAddress.findById(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }
    if (address.customer.toString() !== customerId) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    await ShippingAddress.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Address deleted."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to delete address.", error: error.message });
  }
};

// ==========================
// Set default address
// ==========================
export const setDefaultAddress = async (req, res) => {
  try {
    const customerId = req.person.id;
    const { id } = req.params;

    // Validate address ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid address information." });
    }

    let address = await ShippingAddress.findById(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    if (address.customer.toString() !== customerId) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    await ShippingAddress.updateMany({ customer: customerId }, { $set: { isDefault: false } });
    address = await ShippingAddress.findByIdAndUpdate(id, { $set: { isDefault: true } }, { new: true });

    res.status(200).json({
      success: true,
      message: "Default address set.",
      address
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to set default address.", error: error.message });
  }
};