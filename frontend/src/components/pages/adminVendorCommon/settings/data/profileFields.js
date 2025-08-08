// components/pages/profile/data/profileFields.js

export const profileSections = [
  {
    title: "Basic Information",
    fields: [
      { label: "Name", name: "name", type: "text", required: true },
      { label: "Email", name: "email", type: "email", required: true },
    ],
  },
  {
    title: "Address Details",
    fields: [
      { label: "Address Line 1", name: "address.line1", type: "text", required: true },
      { label: "Address Line 2", name: "address.line2", type: "text" },
      { label: "Locality", name: "address.locality", type: "text" },
      { label: "City", name: "address.city", type: "text", required: true },
      { label: "State", name: "address.state", type: "text", required: true },
      { label: "Country", name: "address.country", type: "text", required: true },
      { label: "Pincode", name: "address.pincode", type: "text", required: true },
      { label: "Geo Lat", name: "address.geoLocation.lat", type: "number" },
      { label: "Geo Lng", name: "address.geoLocation.lng", type: "number" },
    ],
  },
];