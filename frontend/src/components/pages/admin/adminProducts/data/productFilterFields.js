export const productFilterFields = [
  {
    name: "search",
    label: "Search by product name or category",
    type: "text"
  },
  {
    name: "status",
    label: "Approval Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "approved", label: "Approved" },
      { value: "not_approved", label: "Not Approved" },
    ],
  },
];
