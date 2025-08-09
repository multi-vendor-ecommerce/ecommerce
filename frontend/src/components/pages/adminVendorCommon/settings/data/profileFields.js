export const profileSections = [
  {
    title: "Basic Information",
    fields: [
      { label: "Name", title: "Name", name: "name", type: "text", required: true, placeholder: "Enter your full name" },
      { label: "Email", title: "Can't change email", name: "email", type: "email", required: true, placeholder: "abc@example.com" },
    ],
  },
  {
    title: "Address Details",
    fields: [
      { label: "Address Line 1", title: "Address Line 1", name: "address.line1", type: "text", required: true, placeholder: "Street address, P.O. box, company name" },
      { label: "Address Line 2", title: "Address Line 2", name: "address.line2", type: "text", placeholder: "Apartment, suite, unit, building, floor, etc." },
      { label: "Recipient Name", title: "Recipient Name", name: "address.recipientName", type: "text", placeholder: "Full name of the recipient" },
      { label: "Recipient Phone Number", title: "Recipient Phone Number", name: "address.recipientPhone", type: "tel", placeholder: "e.g. +91 9876543210" },
      { label: "Locality", title: "Locality", name: "address.locality", type: "text", placeholder: "Neighborhood, area, or landmark" },
      { label: "City", title: "City", name: "address.city", type: "text", required: true, placeholder: "e.g. Mumbai" },
      { label: "State", title: "State", name: "address.state", type: "text", required: true, placeholder: "e.g. Maharashtra" },
      { label: "Country", title: "Country", name: "address.country", type: "text", required: true, placeholder: "e.g. India" },
      { label: "Pincode", title: "Pincode", name: "address.pincode", type: "text", required: true, placeholder: "6-digit postal code" },
      { label: "Geo Lat", title: "Geo Latitude", name: "address.geoLocation.lat", type: "number", placeholder: "Latitude" },
      { label: "Geo Lng", title: "Geo Longitude", name: "address.geoLocation.lng", type: "number", placeholder: "Longitude" },
    ],
  },
];