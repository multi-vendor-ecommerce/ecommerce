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
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;
        const isDone = currentStep > stepNum;

        let styles = "";
        if (isDone) {
          styles = "text-green-600 font-semibold";
        } else if (isActive) {
          styles = `text-blue-600 font-semibold ${highlightCurrentStep ? "md:bg-purple-100 md:rounded-xl md:px-2" : ""}`;
        }

        return (
          <div
            key={index}
            className={`w-full md:w-auto flex items-center gap-2 flex-wrap break-words ${styles}`}
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