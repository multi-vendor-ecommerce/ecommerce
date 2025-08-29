import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import Button from "../../../common/Button";

const ProfileActionButtons = ({
  editing,
  isLoading,
  onEdit,
  onCancel,
  onSave,
  cancelText = "Cancel",
  saveText = "Save",
  editText = "Edit Details"
}) => (
  <div className="flex gap-4 mb-4">
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
          disabled={isLoading}
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

export default ProfileActionButtons;