export const formatNumber = (n) => {
  if (n === undefined || n === null || isNaN(n)) return "0";
  const rounded = Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  if (rounded >= 1_000_000) return (rounded / 1_000_000).toFixed(1) + "M";
  if (rounded >= 1_000) return (rounded / 1_000).toFixed(1) + "K";
  return rounded.toString();
};