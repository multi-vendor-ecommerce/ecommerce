// SavedAddresses.jsx
import React, { useState } from "react";

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState([
    "123 Street, Delhi - 110001",
    "456 Sector, Noida - 201301",
  ]);
  const [newAddress, setNewAddress] = useState("");

  const handleAdd = () => {
    if (newAddress) {
      setAddresses([...addresses, newAddress]);
      setNewAddress("");
    }
  };

  const handleDelete = (index) => {
    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Saved Addresses</h2>
      <ul className="space-y-2">
        {addresses.map((addr, i) => (
          <li key={i} className="flex justify-between bg-gray-100 p-2 rounded">
            <span>{addr}</span>
            <button onClick={() => handleDelete(i)} className="text-red-500 hover:underline">Remove</button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className="input flex-1"
          placeholder="Add new address"
        />
        <button onClick={handleAdd} className="btn-primary">Add</button>
      </div>
    </div>
  );
}
