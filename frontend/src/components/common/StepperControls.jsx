// components/common/StepperControls.jsx
const StepperControls = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextDisabled = false,
  backDisabled = false,
  isLastStep = false,
  showSubmit = false,
  loading = false,
}) => {
  return (
    <div className="flex justify-between gap-4 pt-4">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          className="w-full bg-gray-400 text-white py-3.5 rounded-xl hover:bg-gray-500 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          Back
        </button>
      )}

      {isLastStep ? (
        showSubmit && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        )
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default StepperControls;
