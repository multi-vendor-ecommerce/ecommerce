import React from "react";

const cards = [
  { label: "Revenue", value: "₹145K", color: "bg-green-100", icon: "₹" },
  { label: "Orders", value: 932, color: "bg-blue-100", icon: "O" },
  { label: "Customers", value: 1583, color: "bg-purple-100", icon: "👤" },
  { label: "Products", value: 264, color: "bg-yellow-100", icon: "📦" },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className={`${c.color} p-4 rounded shadow flex items-center`}>
          <div className="text-2xl mr-4">{c.icon}</div>
          <div>
            <p className="text-sm font-medium">{c.label}</p>
            <p className="text-xl font-bold">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
