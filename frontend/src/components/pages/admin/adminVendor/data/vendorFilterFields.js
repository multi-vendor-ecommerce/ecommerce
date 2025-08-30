export const vendorFilterFields = [
  { name: "search", label: "Search by name, email, or shop name", type: "text" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "active", label: "Active" },
      { value: "suspended", label: "Suspended" },
      { value: "pending", label: "Pending" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];