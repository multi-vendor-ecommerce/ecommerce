import { useState } from "react";
import { clsx } from "clsx";
import { dateOptions, cards } from "./data/summaryData";

export default function SummaryCards() {
  const [selectedRange, setSelectedRange] = useState("This Month");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="mt-4 md:mt-0 border border-gray-300 p-2 rounded-md text-sm focus:outline-none"
        >
          {dateOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={
              clsx(
                c.bgColor,
                "p-5 rounded-xl shadow-sm transition duration-200 flex items-center hover:shadow-md",
                {
                  "hover:shadow-green-500": c.shadowColor === "shadow-green-500",
                  "hover:shadow-blue-500": c.shadowColor === "shadow-blue-500",
                  "hover:shadow-purple-500": c.shadowColor === "shadow-purple-500",
                  "hover:shadow-yellow-500": c.shadowColor === "shadow-yellow-500",
                }
              )}
          >
            <div className="text-3xl mr-4">{c.icon}</div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide">{c.label}</p>
              <p className="text-2xl font-bold mt-1">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}
