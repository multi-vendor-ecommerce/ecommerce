import Button from "../../../common/Button";
import { inputFields } from "./data/addCouponInputFields";

const AddCoupon = ({ form, errors, handleChange, handleAddCoupon }) => {
  return (
    <div className="w-full bg-white hover:shadow-blue-500 shadow-md transition duration-200 rounded-xl border border-gray-200 p-6 mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-4">Add New Coupon</h3>

      <div className="w-full grid md:grid-cols-5 gap-4">
        {inputFields.map(({ id, label, type, placeholder, min, step }) => (
          <div key={id} className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-600">
              {label}
            </label>

            {type === "checkbox" ? (
              <input
                id={id}
                name={id}
                type="checkbox"
                checked={form[id] || false}
                onChange={(e) => handleChange({ target: { name: id, value: e.target.checked } })}
                className="w-5 h-5 mt-1"
              />
            ) : (
              <input
                id={id}
                name={id}
                type={type}
                min={min}
                step={step}
                value={form[id] ?? ""}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}

            {errors[id] && (
              <span className="text-sm text-red-600">{errors[id]}</span>
            )}
          </div>
        ))}
      </div>

      <Button text="Add Coupon" className="mt-6 py-3 border-blue-500 text-blue-600" onClick={handleAddCoupon} />
    </div>
  );
};

export default AddCoupon;