export function setNestedValueIfAllowed(obj, path, value, allowedFields = []) {
  if (!allowedFields || !path) return;
  if (allowedFields.includes(path)) {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== "object") current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
}