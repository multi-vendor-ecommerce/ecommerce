export const formatAddress = (address = {}) => {
  const { line1 = "", line2 = "", locality = "", city = "", state = "", country = "India", pincode = "" } = address;

  const parts = [line1, line2, locality, city, state, country, pincode]
    .filter(Boolean) // Remove empty strings
    .map((part) => part.trim());

  return parts.join(", ");
};

export const shortFormatAddress = (address = {}) => {
  const { city = "", state = "", country = "India", pincode = "" } = address;

  const parts = [city, state, country, pincode]
    .filter(Boolean) // Remove empty strings
    .map((part) => part.trim());

  return parts.join(", ");
};