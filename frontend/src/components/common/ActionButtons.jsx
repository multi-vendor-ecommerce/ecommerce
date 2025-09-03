import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import Button from "./Button";

const ActionButtons = ({
  editing,
  isLoading,
  onEdit,
  onCancel,
  onSave,
  disableSave, // renamed from hasChanges for clarity
  cancelText = "Cancel",
  saveText = "Save",
  editText = "Edit Details"
}) => (
  <div className="flex gap-4 items-center">
    {editing ? (
      <>
        <Button
          icon={FiX}
          text={cancelText}
          onClick={onCancel}
          disabled={isLoading}
          className="py-2"
          color="red"
        />
        <Button
          icon={FiCheck}
          text={isLoading ? "Saving..." : saveText}
          onClick={onSave}
          disabled={disableSave || isLoading}
          className="py-2"
          color="green"
        />
      </>
    ) : (
      <Button
        icon={FiEdit}
        text={editText}
        className="py-2"
        onClick={onEdit}
      />
    )}
  </div>
);

export default ActionButtons;