// ——— filter options ——————————————————————————
export const orderFilterFields = [
  {
    name: "search",
    label: "Search by payment method",
    type: "text"
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "New / Ready to Ship", label: "New / Ready to Ship" },
      { value: "Pickups / Manifests", label: "Pickups / Manifests" },
      { value: "In Transit", label: "In Transit" },
      { value: "Delivered", label: "Delivered" },
      { value: "RTO", label: "RTO" },
      { value: "Exceptions", label: "Exceptions" },
    ]
  },
  {
    name: "date",
    label: "Order Date",
    type: "date",
    max: new Date().toISOString().split("T")[0],
  }
];