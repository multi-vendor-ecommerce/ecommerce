export const formatNumber = (n) => {
  if (n === undefined || n === null || isNaN(n)) return "0";
  const num = Number(n);

  // Only round if the number is a float (has decimals)
  const isFloat = !Number.isInteger(num);

  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return isFloat ? num.toFixed(2) : num.toString();
};