import { FiCheckCircle } from 'react-icons/fi';

const Stepper = ({ stepLabels = [], currentStep, className = "" }) => {
  return (
    <div className={`${className}`}>
      {stepLabels.map((label, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 flex-wrap break-words ${
            currentStep === index + 1 ? "text-blue-700 font-semibold md:bg-purple-100 md:rounded-xl md:px-2" : ""
          }`}
        >
          <FiCheckCircle size={18} />
          {label}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
