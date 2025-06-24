import React, { useState } from "react";
import addressesData from "../../../data/addressData";

export default function Address() {
  const [addresses, setAddresses] = useState(addressesData);

  const handleDelete = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-user-primary mb-4">My Addresses</h2>

      {addresses.map((a) => (
        <div
          key={a.id}
          className="bg-white shadow rounded p-4 mb-4 border-l-4 border-user-primary relative"
        >
          <h4 className="text-user-dark font-semibold">{a.name}</h4>
          <p className="text-sm text-gray-600">{a.phone}</p>
          <p className="text-sm text-gray-700">{a.address}</p>
          <p className="text-sm text-gray-500">PIN: {a.pin}</p>
          <button
            onClick={() => handleDelete(a.id)}
            className="absolute top-2 right-3 text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      {addresses.length === 0 && (
        <p className="text-gray-600">No address added yet.</p>
      )}

      {/* 🔧 Future: Add new address form */}
    </div>
  );
}
