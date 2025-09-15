import InputField from "../../../../common/InputField";
import { addProductFields } from "../data/addProductFields";
import CustomSelect from "../../../../common/layout/CustomSelect";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";
import StepperControls from "../../../../common/StepperControls";

const ProductDetails = ({
  formData,
  handleInputChange,
  step = 4,
  nextStep,
  prevStep,
  setFormData,
  loading,
  handleSubmit,
  isEditing = true,
  showStepper = true
}) => {
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
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2 mt-4">
        <label htmlFor="visibility" className="block font-medium text-gray-700">Visibility</label>
        <CustomSelect
          options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Private" }
          ]}
          value={formData.visibility}
          onChange={(value) => setFormData((prev) => ({ ...prev, visibility: value }))}
          menuPlacement="auto"
          isDisabled={!isEditing}
        />
      </div>

      {isEditing && showStepper && (
        <StepperControls
          currentStep={step}
          onNext={nextStep}
          onBack={prevStep}
          isLastStep={step === 4}
          showSubmit={
            step === 4 &&
            !["description", "price", "stock", "gstRate"].some(
              field => !String(formData[field] ?? "").trim()
            )
          }
          submitButton={['Add Product', 'Adding']}
          loading={loading}
          onSubmitClick={handleSubmit}
        />
      )}
    </>
  );
}

export default ProductDetails;