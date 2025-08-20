import ShippingAddress from "../models/ShippingAddress.js";

export const getShippingInfoForOrder = async (user) => {
    // 1. check default address
    const defaultAddress = await ShippingAddress.findOne({ customer: user._id, isDefault: true });

    if (defaultAddress) {
        return {
            recipientName: defaultAddress.recipientName,
            recipientPhone: defaultAddress.recipientPhone,
            line1: defaultAddress.line1,
            line2: defaultAddress.line2 || "",
            locality: defaultAddress.locality || "",
            city: defaultAddress.city,
            state: defaultAddress.state,
            country: defaultAddress.country || "India",
            pincode: defaultAddress.pincode,
            geoLocation: defaultAddress.geoLocation || {},
        };
    }

    // 2. user model address if there is no default shipping address found
    if (user.address) {
        return {
            recipientName: user.address.recipientName || user.name,
            recipientPhone: user.address.recipientPhone || user.phone,
            line1: user.address.line1,
            line2: user.address.line2 || "",
            locality: user.address.locality || "",
            city: user.address.city,
            state: user.address.state,
            country: user.address.country || "India",
            pincode: user.address.pincode,
            geoLocation: user.address.geoLocation || {},
        };
    }

    // 3. Fallback 
    return {};
};