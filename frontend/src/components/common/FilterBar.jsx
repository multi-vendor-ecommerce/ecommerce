import { FiFilter } from "react-icons/fi";
import { BsXCircle } from "react-icons/bs";

const FilterBar = ({ fields = [], values = {}, onChange, onApply, onClear, onKeyDown }) => {
  return (
    <div className="w-full flex flex-wrap gap-4 items-start mb-6">
      <div className="flex flex-wrap gap-4 w-full md:w-auto">
        {fields.map((field) => {
          const { name, label, type, options = [] } = field;
          const value = values[name] || "";

          if (type === "text" || type === "date") {
            return (
              <input
                key={name}
                type={type}
                value={value}
                placeholder={label}
                onChange={(e) => onChange(name, e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full md:w-auto p-2 border border-gray-300 bg-white rounded-md shadow-sm"
              />
            );
          }

          if (type === "select") {
            return (
              <select
                key={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full md:w-auto p-2 border border-gray-300 rounded-md shadow-sm"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
          }

          return null;
        })}
      </div>

      <div className="flex gap-2 w-full md:w-auto justify-center md:justify-start">
        <button
          onClick={onApply}
          className="w-1/2 md:w-auto px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-md hover:bg-blue-700 shadow-md flex items-center justify-center gap-2"
        >
          <FiFilter size={20} className="min-w-[1.2rem]" />
          <span className="hidden md:inline">Apply Filters</span>
        </button>

        <button
          onClick={onClear}
          className="w-1/2 md:w-auto px-3 py-2 bg-gray-300 text-gray-800 cursor-pointer rounded-md hover:bg-gray-400 shadow-sm flex items-center justify-center gap-2"
        >
          <BsXCircle size={20} className="min-w-[1.2rem]" />
          <span className="hidden md:inline">Clear</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
