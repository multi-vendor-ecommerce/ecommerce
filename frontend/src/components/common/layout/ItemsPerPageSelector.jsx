// components/common/ItemsPerPageSelector.jsx
import Select from "react-select";

const options = [
  { value: 5, label: "5 / page" },
  { value: 10, label: "10 / page" },
  { value: 20, label: "20 / page" },
  { value: 50, label: "50 / page" },
];

const responsiveFont = {
  fontSize: "0.875rem",           // 14px default (mobile)
  "@media (min-width: 640px)": {
    fontSize: "1rem",             // 16px on ≥640px
  },
};

const customStyles = {
  control: (provided) => ({
    ...provided,
    ...responsiveFont,
    borderRadius: "0.75rem",
    borderColor: "#e5e7eb",
    minWidth: "140px",
    fontWeight: 500,
    padding: "4px 6px",
    boxShadow: "none",
    "&:hover": { borderColor: "#93c5fd" },
  }),

  option: (provided, state) => ({
    ...provided,
    ...responsiveFont,
    backgroundColor: state.isFocused ? "#ebf8ff" : "white",
    color: state.isFocused ? "#1e40af" : "#374151",
    cursor: "pointer",
    padding: "8px 12px",
    fontWeight: 500,
  }),

  menu: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: 8,
  }),

  menuList: (provided) => ({
    ...provided,
    padding: "4px 0",
  }),
};

const ItemsPerPageSelector = ({ value, onChange }) => (
  <Select
    value={options.find((opt) => opt.value === value)}
    onChange={(selected) => onChange(selected.value)}
    options={options}
    styles={customStyles}
    isSearchable={false}
    menuPlacement="top"
  />
);

export default ItemsPerPageSelector;
