export const productFilterFields = [
  {
    name: "search",
    label: "Search by product name or brand",
    type: "text"
  },
  {
    name: "status",
    label: "Approval Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "approved", label: "Approved" },
      { value: "pending", label: "Pending" },
      { value: "rejected", label: "Rejected" },
    ],
  },
];
