import { FiExternalLink } from "react-icons/fi";
import InputField from "../../../../common/InputField";
import { addProductFields } from "../data/addProductFields";
import StepperControls from "../../../../common/StepperControls";

const BasicInfo = ({
  formData,
  step = 3,
  nextStep,
  prevStep,
  handleInputChange,
  isEditing = true,
  showStepper = true,
  loading
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
              value={
                Array.isArray(formData[field.name])
                  ? formData[field.name].join(", ")
                  : formData[field.name] || ""
              }
              onChange={handleInputChange}
              disabled={!isEditing || loading} // <-- use isEditing to control editability
            />
            {field.name === "hsnCode" && (
              <a
                href={field.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="md:ml-1.5 text-blue-600 hover:text-blue-800 truncate"
              >
                <span className="inline-flex gap-1 mt-1 items-center text-sm md:text-base">
                  <span className="hover:underline hover:decoration-dotted">
                    {field.link.text}
                  </span>
                  <FiExternalLink size={16} />
                </span>
              </a>
            )}
          </div>
        ))}
      </div>

      {isEditing && showStepper && (
        <StepperControls
          currentStep={step}
          onNext={nextStep}
          onBack={prevStep}
          nextDisabled={
            step === 3 &&
            [formData.brand,
            formData.title,
            formData.tags,
            formData.sku,
            formData.hsnCode,
            formData["dimensions.length"],
            formData["dimensions.width"],
            formData["dimensions.height"],
            formData.weight
            ].some(val => !String(val || "").trim())
          }
        />
      )}
    </>
  )
}

export default BasicInfo;