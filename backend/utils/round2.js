export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}