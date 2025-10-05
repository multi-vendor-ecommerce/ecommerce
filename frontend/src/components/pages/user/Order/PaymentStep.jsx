import StepperControls from "../../../common/StepperControls";
import CustomSelect from "../../../common/layout/CustomSelect";

const PaymentStep = ({ modeOfPayment, setModeOfPayment, handlePayment, step, next, prev, loading }) => {
  const paymentOptions = [
    { value: "COD", label: "Cash on Delivery" },
    { value: "ONLINE", label: "Online Payment" },
  ];

  return (
    <form className="space-y-4">
      <h2 className="text-xl font-bold">Payment</h2>

      <CustomSelect
        options={paymentOptions}
        value={modeOfPayment}
        onChange={setModeOfPayment}
        menuPlacement="auto"
      />
      
      <StepperControls
        currentStep={step}
        onNext={next}
        onBack={prev}
        isLastStep={step === 3}
        showSubmit={!!modeOfPayment}
        loading={loading}
        submitButton={["Confirm Order", "Processing..."]}
        onSubmitClick={handlePayment}
      />
    </form>
  );
};

export default PaymentStep;
