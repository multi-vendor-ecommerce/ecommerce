export const getFormattedAddress = (address = {}) => {
  const { line1 = "", line2 = "", locality = "", city = "", state = "", country = "India", pincode = "" } = address;

  const parts = [line1, line2, locality, city, state, country, pincode]
    .filter(Boolean) // Remove empty strings
    .map((part) => part.trim());

  return parts.join(", ");
};