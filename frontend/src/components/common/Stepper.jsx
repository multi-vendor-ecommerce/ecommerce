import { FiCheckCircle } from "react-icons/fi";

const Stepper = ({
  stepLabels = [],
  currentStep,
  className = "",
  highlightCurrentStep = false,
}) => {
  return (
    <div className={className}>
      {stepLabels.map((label, index) => {
        const isActive = currentStep === index + 1;

        const activeStyles = isActive
          ? `text-blue-700 font-semibold ${
              highlightCurrentStep ? "md:bg-purple-100 md:rounded-xl md:px-2" : ""
            }`
          : "";

        return (
          <div
            key={index}
            className={`flex items-center gap-2 flex-wrap break-words ${activeStyles}`}
          >
            <FiCheckCircle size={18} />
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;