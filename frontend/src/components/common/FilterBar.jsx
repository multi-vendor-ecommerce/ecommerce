import { FiFilter } from "react-icons/fi";
import { BsXCircle } from "react-icons/bs";
import CustomSelect from "./layout/CustomSelect";

const FilterBar = ({ fields = [], values = {}, onChange, onApply, onClear }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onApply();
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex flex-wrap gap-4 w-full md:w-auto">
        {fields.map((field) => {
          const { name, label, type, options = [] } = field;
          const value = values[name] || "";

          if (type === "text" || type === "date") {
            return (
              <div key={name} className="w-full md:w-auto">
                <input
                  key={name}
                  type={type}
                  value={value}
                  placeholder={label}
                  onChange={(e) => onChange(name, e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-full lg:min-w-[300px] bg-white px-3 py-2 border border-gray-300 rounded-xl shadow-sm text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 hover:border-blue-300 transition-all duration-150"
                />
              </div>
            );
          }

          if (type === "select") {
            return (
              <div key={name}>
                <CustomSelect
                  value={value}
                  onChange={(val) => onChange(name, val)}
                  options={options}
                  menuPlacement="auto"
                />
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="flex gap-2 w-full md:w-auto justify-center md:justify-start">
        <button
          onClick={onApply}
          className="w-1/2 md:w-auto px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700 shadow-md flex items-center justify-center gap-2"
        >
          <FiFilter size={20} className="min-w-[1.2rem]" />
          <span className="hidden md:inline">Apply Filters</span>
        </button>

        <button
          onClick={onClear}
          className="w-1/2 md:w-auto px-3 py-2 bg-gray-300 text-gray-800 cursor-pointer rounded-lg hover:bg-gray-400 shadow-sm flex items-center justify-center gap-2"
        >
          <BsXCircle size={20} className="min-w-[1.2rem]" />
          <span className="hidden md:inline">Clear</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
