// ==========================
// Convert string to Title Case (handles camelCase, snake_case, kebab-case, and spaces)
// ==========================
export const toTitleCase = (str = "") =>
  str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // convert camelCase to spaces
    .replace(/[_-]/g, " ")               // convert snake_case and kebab-case to spaces
    .toLowerCase()
    .split(/([\s,]+)/)                   // keeps spaces and commas as separators
    .map((word) =>
      /^[a-z]/.test(word) ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join("");