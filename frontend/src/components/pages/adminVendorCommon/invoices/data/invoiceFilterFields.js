export const invoiceFilterFields = [
  {
    name: "search",
    label: "Search by invoice number or payment method",
    type: "text"
  },
  {
    name: "date",
    label: "Order Date",
    type: "date",
    max: new Date().toISOString().split("T")[0],
  }
];