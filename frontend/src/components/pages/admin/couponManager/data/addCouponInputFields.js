export const inputFields = [
  {
    id: "code",
    label: "Code",
    type: "text",
    placeholder: "COUPON2025",
  },
  {
    id: "discount",
    label: "Discount (₹)",
    type: "number",
    min: 0,
    step: 1,
  },
  {
    id: "minPurchase",
    label: "Min Purchase (₹)",
    type: "number",
    min: 0,
    step: 1,
  },
  {
    id: "maxDiscount",
    label: "Max Discount (₹)",
    type: "number",
    min: 0,
    step: 1,
  },
  {
    id: "expiryDate",
    label: "Expiry Date",
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
  {
    id: "isActive",
    label: "Is Active?",
    type: "checkbox",
  },
];
