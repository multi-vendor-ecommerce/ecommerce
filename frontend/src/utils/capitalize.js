// utils/stringUtils.js
export const capitalize = (str = "") => {
  if (typeof str !== "string" || !str.trim()) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};