import Button from "../../../common/Button";
import { inputFields } from "./data/addCouponInputFields";
import InputField from "../../../common/InputField";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";

const AddEditCoupon = ({ form, errors, handleChange, handleAddCoupon, isEditing }) => {
  return (
    <div className="w-full bg-white hover:shadow-blue-500 shadow-md transition duration-200 rounded-xl border border-gray-200 p-6 mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-4">
        {isEditing ? "Edit Coupon" : "Add New Coupon"}
      </h3>

      <div className="w-full grid md:grid-cols-4 gap-4">
        {inputFields.map(({ id, label, type, placeholder, min, step, title, required }) => (
          <div key={id} className="flex flex-col justify-center gap-1">
            {type === "checkbox" ? (
              <div className="flex items-center gap-2 md:mt-8">
                <Checkbox.Root
                  id={id}
                  checked={form[id] || false}
                  onCheckedChange={(checked) => handleChange(id, checked)}
                  className="w-5 h-5 bg-white border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer"
                >
                  <Checkbox.Indicator>
                    <FaCheck size={14} className="text-blue-600" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-gray-700">{label}</span>
              </div>
            ) : (
              <InputField
                label={`${label}${required ? " *" : ""}`}
                name={id}
                type={type}
                placeholder={type !== "text" ? placeholder : ""}
                value={form[id] ?? ""}
                onChange={(e) => handleChange(id, e.target.value)}
                title={title}
                min={min}
                step={step}
              />
            )}

            {errors[id] && (
              <span className="text-sm text-red-600">{errors[id]}</span>
            )}
          </div>
        ))}
      </div>

      <Button
        text={isEditing ? "Update Coupon" : "Add Coupon"}
        className="mt-6 py-3"
        disabled={!form.code.trim() || !form.discount || !form.minPurchase || !form.expiryDate || !form.usageLimit}
        onClick={handleAddCoupon}
      />
    </div>
  );
};

export default AddEditCoupon;
