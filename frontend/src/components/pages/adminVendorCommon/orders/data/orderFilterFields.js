// ——— filter options ——————————————————————————
export const orderFilterFields = [
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

export const SHIPROCKET_TABS = [
  { key: "", label: "All" },
  { key: "NEW_READY_TO_SHIP", label: "New / Ready to Ship" },
  { key: "PICKUPS_MANIFESTS", label: "Pickups / Manifests" },
  { key: "IN_TRANSIT", label: "In Transit" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "RTO", label: "RTO" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "EXCEPTIONS", label: "Exceptions" },
];