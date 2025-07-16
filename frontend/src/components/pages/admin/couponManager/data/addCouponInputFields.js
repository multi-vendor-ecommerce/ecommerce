export const inputFields = [
  {
    id: "code",
    label: "Code",
    type: "text",
    placeholder: "COUPON2025",
  },
  {
    id: "value",
    label: "Value (₹)",
    type: "number",
    min: 0,
    step: 1,
  },
  {
    id: "minOrder",
    label: "Min Order (₹)",
    type: "number",
    min: 0,
    step: 1,
  },
  {
    id: "expiry",
    label: "Expiry",
    type: "date",
    min: new Date().toISOString().split("T")[0],
  },
  {
    id: "usageLimit",
    label: "Usage Limit",
    type: "number",
    min: 1,
    step: 1,
  },
];
