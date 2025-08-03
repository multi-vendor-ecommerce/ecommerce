// components/common/Stepper.jsx
import { FiCheckCircle } from 'react-icons/fi';

const Stepper = ({ stepLabels = [], currentStep }) => {
  return (
    <div className="flex justify-between items-center text-sm font-medium text-gray-700 gap-3 md:gap-1 mb-4">
      {stepLabels.map((label, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 flex-wrap break-words ${currentStep === index + 1 ? "text-blue-600 font-semibold" : ""
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
