// utils/formatDate.js

/**
 * Format a JavaScript Date object to "yyyy-mm-dd hh:mm"
 * @param {Date | string} date - A Date object or a date string
 * @returns {string} Formatted date string
 */
export function formatDate(date = new Date()) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}