export const invoiceFilterFields = [
  {
    name: "search",
    label: "Search by payment method",
    type: "text"
  },
  {
    name: "date",
    label: "Order Date",
    type: "date",
    max: new Date().toISOString().split("T")[0],
  }
];