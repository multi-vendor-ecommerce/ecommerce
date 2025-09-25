import { useContext, useState } from "react";
import { FiEdit } from "react-icons/fi";
import InputField from "../../../common/InputField";
import BackButton from "../../../common/layout/BackButton";
import { changePasswordFields } from "./data/changePasswordFields";
import Button from "../../../common/Button";
import PersonContext from "../../../../context/person/PersonContext";
import { toast } from "react-toastify";

const Security = () => {
  const { person, changePassword, loading } = useContext(PersonContext);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { success, message } = await changePassword(formData);

    if (success) {
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success(message || "Password updated successfully.");
    } else {
      toast.error(message || "Failed to update password.");
    }
  };

  const formValid =
    formData.currentPassword.trim() &&
    formData.newPassword.trim() &&
    formData.confirmPassword.trim();

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <BackButton className={person?.role === "customer" ? "border-green-500 hover:bg-green-700" : "border-purple-500 hover:bg-purple-700"} />

      <div className="mt-4 mb-6 flex justify-between items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Change Password</h2>
      </div>

      <form className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500">
        <div className="flex flex-col gap-8">
          {changePasswordFields.map((field, idx) => (
            <InputField
              key={idx}
              label={`${field.label}${field.required ? " *" : ""}`}
              name={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required}
            />
          ))}
        </div>

        <Button
          icon={FiEdit}
          text={loading ? "Updating..." : "Update Password"}
          onClick={handleSubmit}
          disabled={!formValid || loading}
          className="mt-8 py-3"
        />
      </form>
    </div>
  );
};

export default Security;
