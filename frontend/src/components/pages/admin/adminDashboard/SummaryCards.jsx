import { dateFilterFields, cards } from "./data/summaryData";
import CustomSelect from "../../.././common/layout/CustomSelect";
import { useState } from "react";

export default function SummaryCards() {
  const [dateValue, setDateValue] = useState("");

  const handleChange = (name, value) => {
    if (name === "date") setDateValue(value);
  };

  return (
    <section>
      {/* Header with range selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-3">Overview</h2>

        <div>
          <CustomSelect
            options={dateFilterFields[0].options}
            value={dateValue}
            onChange={(newValue) => handleChange("date", newValue)}
            menuPlacement="bottom"
          />
        </div>
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
