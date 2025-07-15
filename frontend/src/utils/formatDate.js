export function getFormatDate(date = new Date(), short = false) {
  const dateObj = new Date(date);
  if (isNaN(dateObj)) return "Invalid date";

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: short ? 'short' : 'long',
    year: 'numeric'
  }).format(dateObj);
}
