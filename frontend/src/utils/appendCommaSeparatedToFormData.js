/**
 * Appends comma-separated values from a string to FormData under a given key.
 * @param {FormData} formData - The FormData object to append to.
 * @param {string} key - The key under which to append values.
 * @param {string} value - The comma-separated string.
 */
export function appendCommaSeparatedToFormData(formData, key, value) {
  if (!value) return;
  value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v)
    .forEach((v) => formData.append(key, v));
}