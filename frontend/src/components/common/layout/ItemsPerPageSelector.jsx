import CustomSelect from './CustomSelect';

const options = [
  { value: 5, label: "5 / page" },
  { value: 10, label: "10 / page" },
  { value: 20, label: "20 / page" },
  { value: 50, label: "50 / page" },
];

const ItemsPerPageSelector = ({ value, onChange }) => {
  return (
    <CustomSelect
      options={options}
      value={value}
      onChange={onChange}
      menuPlacement="top"
    />
  );
};

export default ItemsPerPageSelector;