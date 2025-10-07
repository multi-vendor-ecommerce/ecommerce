// ——— filter options ——————————————————————————
export const customerFilterFields = [
  {
    name: "search",
    label: "Search by name or email",
    type: "text"
  },
  {
    name: "date",
    label: "Date Joined",
    type: "date",
    max: new Date().toISOString().split("T")[0],
  }
];