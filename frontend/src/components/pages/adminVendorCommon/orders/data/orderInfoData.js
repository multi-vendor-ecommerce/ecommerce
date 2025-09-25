import { formatNumber } from "../../../../../utils/formatNumber";

export const getOrderTotalsData = (order) => ({
  left: [
    {
      label: "GST / Tax:",
      value: `₹${formatNumber(order?.totalTax) ?? "0.00"}`,
    },
    {
      label: "Total Discount:",
      value: `- ₹${formatNumber(order?.totalDiscount) ?? "0.00"}`,
    },
    {
      label: "Subtotal:",
      value: `₹${formatNumber(order?.subTotal) ?? "0.00"}`,
      className: "text-green-600 font-semibold",
    },
  ],
  right: [
    {
      label: "Shipping Charges:",
      value: `₹${formatNumber(order?.shippingCharges) || "0.00"}`,
    },
    {
      label: "Grand Total:",
      value: `₹${formatNumber(order?.grandTotal) || "0.00"}`,
      className: "text-blue-700 font-semibold",
    },
  ],
});