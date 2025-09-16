export const splitAndClean = (val, caseMode = "lower") => {
  const normalize = (v) => {
    if (caseMode === "upper") return v.trim().toUpperCase();
    if (caseMode === "lower") return v.trim().toLowerCase();
    return v.trim();
  };

  return !val || (Array.isArray(val) && val.length === 0) || (typeof val === "string" && !val.trim())
    ? []
    : Array.isArray(val)
      ? val.map(normalize).filter(Boolean)
      : typeof val === "string"
        ? val.split(/\s*,\s*/).map(normalize).filter(Boolean)
        : [];
};
