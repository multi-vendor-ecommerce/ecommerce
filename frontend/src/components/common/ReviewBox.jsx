// components/admin/ReviewBox.jsx
import { FiCheckCircle, FiX } from "react-icons/fi";
import InputField from "./InputField";
import Button from "./Button";

const ReviewBox = ({ 
  value, 
  setValue, 
  onSubmit, 
  onCancel, 
  submitText = "Submit", 
  color = "red",
  disabled = false 
}) => {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <InputField
        label="Remarks"
        name="remarks"
        richtext={true}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Provide remarks..."
      />

      <div className="flex gap-2 flex-col justify-center items-center md:flex-row md:justify-between mt-2">
        <Button
          icon={FiCheckCircle}
          text={submitText}
          onClick={onSubmit}
          color={color}
          className="py-2"
          disabled={disabled}
        />
        <Button
          icon={FiX}
          text="Cancel"
          onClick={onCancel}
          color="gray"
          className="py-2"
        />
      </div>
    </div>
  );
};

export default ReviewBox;
