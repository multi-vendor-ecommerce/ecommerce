export const isFieldEmpty = (value) => {
  if (value == null) return true; // null or undefined
  if (typeof value === "string") return value.trim() === ""; // empty string
  if (Array.isArray(value)) return value.length === 0; // empty array
  if (typeof value === "number") return false; // 0 is valid
  if (typeof value === "object") return Object.values(value).some(isFieldEmpty); // check nested objects
  return false;
};