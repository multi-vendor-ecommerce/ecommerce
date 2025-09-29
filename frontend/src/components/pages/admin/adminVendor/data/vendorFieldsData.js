export const vendorFields = [
  { label: "Name", key: "name" },
  { label: "GST Number", key: "gstNumber" },
  { label: "Email", key: "email" },
  { label: "Mobile Number", key: "phone" },
  {
    label: "Address",
    key: "address",
    render: v =>
      [v.address?.line1, v.address?.city, v.address?.state, v.address?.country, v.address?.pincode]
        .filter(Boolean)
        .join(", "),
  },
  {
    label: "Status",
    key: "status",
    render: v => ({ value: v.status, isStatus: true }),
  },
  {
    label: "Registered At",
    key: "registeredAt",
    render: v => v.registeredAt ? new Date(v.registeredAt).toLocaleDateString() : "—",
  },
];