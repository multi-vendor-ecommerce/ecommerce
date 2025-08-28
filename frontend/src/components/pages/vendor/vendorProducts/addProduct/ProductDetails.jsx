import InputField from "../../../../common/InputField";
import { addProductFields } from "../data/addProductFields";
import CustomSelect from "../../../../common/layout/CustomSelect";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";
import StepperControls from "../../../../common/StepperControls";

const ProductDetails = ({ formData, handleInputChange, step = 4, nextStep, prevStep, setFormData, loading, handleSubmit }) => {
  return (
    <>
      <div className="space-y-4">
        {(addProductFields[step] || []).map((field, idx) => (
          <div key={idx} className="col-span-2">
            <InputField
              label={`${field.label}${field.required ? " *" : ""}`}
              name={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              title={field.title}
              required={field.required}
              value={formData[field.name]}
              onChange={handleInputChange}
            />
          </div>
        ))}
      </div>

      {["isTaxable", "freeDelivery"].map((field) => (
        <label key={field} className="flex items-center gap-2 cursor-pointer">
          <Checkbox.Root
            id={field}
            checked={formData[field]}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, [field]: checked }))
            }
            className="w-5 h-5 bg-white border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer"
          >
            <Checkbox.Indicator>
              <FaCheck size={14} className="text-blue-600" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <span className="text-gray-700">
            {field.replace(/([A-Z])/g, " $1")}
          </span>
        </label>
      ))}

      <div className="space-y-2">
        <label htmlFor="visibility" className="block font-medium text-gray-700">Visibility</label>
        <CustomSelect
          options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Private" }
          ]}
          value={formData.visibility}
          onChange={(value) => setFormData((prev) => ({ ...prev, visibility: value }))}
          menuPlacement="auto"
        />
      </div>

      <StepperControls
        currentStep={step}
        onNext={nextStep}
        onBack={prevStep}
        isLastStep={step === 4}
        showSubmit={
          step === 4 &&
          formData.description.trim() &&
          formData.price.trim() &&
          formData.stock.trim() &&
          formData.gstRate.trim()
        }
        submitButton={['Add Product', 'Adding']}
        loading={loading}
        onSubmitClick={handleSubmit}
      />
    </>
  )
}

export default ProductDetails;