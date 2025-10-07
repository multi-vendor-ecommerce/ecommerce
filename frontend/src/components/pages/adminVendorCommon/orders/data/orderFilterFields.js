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

export const shiprocketTabs = [
  { key: "", label: "All" },
  { key: "new_ready_to_ship", label: "New / Ready to Ship" },
  { key: "pickups_manifests", label: "Pickups / Manifests" },
  { key: "in_transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
  { key: "rto", label: "RTO" },
  { key: "cancelled", label: "Cancelled" },
  { key: "exceptions", label: "Exceptions" },
];