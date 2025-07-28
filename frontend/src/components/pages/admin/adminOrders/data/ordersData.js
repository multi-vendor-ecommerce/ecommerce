// ——— filter options ——————————————————————————
export const orderFilterFields = [
  {
    name: "search",
    label: "Search by customer or vendor",
    type: "text"
  },
  {
    name: "status",
    label: "Order Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "pending", label: "Pending" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "cancelled", label: "Cancelled" }
    ]
  },
  {
    name: "date",
    label: "Order Date",
    type: "date"
  }
];
