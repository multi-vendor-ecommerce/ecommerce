import { useState } from "react";
import { dateOptions, cards } from "./data/summaryData";

export default function SummaryCards() {
  const [selectedRange, setSelectedRange] = useState("This Month");

  return (
    <section>
      {/* Header with range selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-3">Overview</h2>

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

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`p-5 rounded-xl shadow-sm transition duration-200 flex items-center ${card.bgColor} hover:shadow-md ${card.shadowColor}`}
            >
              {/* Icon */}
              <Icon className="text-3xl mr-4" />

              {/* Label + value */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
