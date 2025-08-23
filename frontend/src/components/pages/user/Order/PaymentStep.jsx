import StepperControls from "../../../common/StepperControls";

const PaymentStep = ({ modeOfPayment, setModeOfPayment, handlePayment, step, next, prev }) => {
  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <h2 className="text-xl font-bold">Payment</h2>

      {/* Payment options */}
      <select
        value={modeOfPayment}
        onChange={(e) => setModeOfPayment(e.target.value)}
        className="border p-2 rounded w-full"
        required
      >
        <option value="COD">Cash on Delivery</option>
        <option value="ONLINE">Online Payment</option>
      </select>

      {/* Stepper Controls */}
      <StepperControls
        currentStep={step}
        onNext={next}
        onBack={prev}
        isLastStep={step === 3}
        showSubmit={!!modeOfPayment}
        loading={loading}
        submitButton={["Confirm Order", "Processing..."]}
      />
    </form>
  );
};

export default PaymentStep;
