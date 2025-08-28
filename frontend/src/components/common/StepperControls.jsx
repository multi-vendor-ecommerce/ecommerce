// components/common/StepperControls.jsx
const StepperControls = ({
  currentStep,
  onNext,
  onBack,
  nextDisabled = false,
  backDisabled = false,
  isLastStep = false,
  showSubmit = false,
  loading = false,
  submitButton = [],
  onSubmitClick
}) => {
  return (
    <div className="flex justify-between gap-4 pt-4">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          className="w-full bg-gray-400 text-white py-3.5 rounded-xl transition flex items-center justify-center gap-2
                     hover:bg-gray-500
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        >
          Back
        </button>
      )}

      {isLastStep ? (
        showSubmit && (
          <button
            type="button"
            onClick={onSubmitClick}
            disabled={loading}
            id="add-product-btn"
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl transition flex items-center justify-center gap-2
                       hover:bg-blue-700
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {loading ? submitButton[1] : submitButton[0]}
          </button>
        )
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl transition flex items-center justify-center gap-2
                     hover:bg-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default StepperControls;
