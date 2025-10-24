export const dateFilterFields = [
  {
    name: "date",
    label: "Filter by Date",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "today", label: "Today" },
      { value: "yesterday", label: "Yesterday" },
      { value: "this_week", label: "This Week" },
      { value: "this_month", label: "This Month" },
      { value: "quarterly", label: "Quarterly" },
      { value: "yearly", label: "Yearly" },
      { value: "custom", label: "Custom Date" },
    ],
  },
];