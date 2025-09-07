// components/common/ItemsPerPageSelector.jsx
import Select from "react-select";

const responsiveFont = {
  fontSize: "0.875rem", // 14px default (mobile)
  "@media (min-width: 640px)": {
    fontSize: "1rem", // 16px on ≥640px
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
    zIndex: 9999, // Ensure it appears above modals and other UI
  }),

  menuList: (provided) => ({
    ...provided,
    padding: "4px 0",
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 9999, // Keep it above everything else
  }),
};

const CustomSelect = ({ options, value, onChange, menuPlacement = "auto", isDisabled = false }) => (
  <Select
    value={options.find((opt) => opt.value === value)}
    onChange={(selected) => onChange(selected.value)}
    options={options}
    styles={customStyles}
    isDisabled={isDisabled}
    isSearchable={false}
    menuPlacement={menuPlacement}
    menuPosition="fixed" // Positions relative to the viewport
    menuPortalTarget={document.body} // Renders dropdown outside parent
  />
);

export default CustomSelect;
