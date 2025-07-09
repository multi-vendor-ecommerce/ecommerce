// ChangePassword.jsx
import React, { useState } from "react";

export default function ChangePassword() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  return (
    <form className="space-y-4">
      <h2 className="text-xl font-semibold">Change Password</h2>
      <input type="password" name="current" value={passwords.current} onChange={handleChange} className="input" placeholder="Current Password" />
      <input type="password" name="new" value={passwords.new} onChange={handleChange} className="input" placeholder="New Password" />
      <input type="password" name="confirm" value={passwords.confirm} onChange={handleChange} className="input" placeholder="Confirm Password" />
      <button type="button" className="btn-primary">Update Password</button>
    </form>
  );
}
