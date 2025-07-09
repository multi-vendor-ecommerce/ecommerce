// ProfileInfo.jsx
import React, { useState } from "react";

export default function ProfileInfo() {
  const [formData, setFormData] = useState({
    name: "Sandhya Maurya",
    email: "sandhya@example.com",
    phone: "9876543210",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="space-y-4">
      <h2 className="text-xl font-semibold">Profile Information</h2>
      <input name="name" value={formData.name} onChange={handleChange} className="input" placeholder="Name" />
      <input name="email" value={formData.email} onChange={handleChange} className="input" placeholder="Email" />
      <input name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="Phone" />
      <button type="button" className="btn-primary">Update Profile</button>
    </form>
  );
}
