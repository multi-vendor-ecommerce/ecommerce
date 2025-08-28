// ==========================
// Convert string to Title Case
// ==========================
export const toTitleCase = (str = "") =>
  str
    .toLowerCase()
    .split(/([\s,-]+)/) // keeps spaces, commas, hyphens as separators
    .map((word) =>
      /^[a-z]/.test(word) ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join("");
