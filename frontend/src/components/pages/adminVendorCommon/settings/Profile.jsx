import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonContext from "../../../../context/person/PersonContext";
import BackButton from "../../../common/layout/BackButton";
import InputField from "../../../common/InputField";
import { profileSections } from "./data/profileFields";
import { FiTrash2 } from "react-icons/fi";
import Loader from "../../../common/Loader";
import useProfileUpdate from "../../../../hooks/useProfileUpdate";
import Button from "../../../common/Button";
import { capitalize } from "../../../../utils/capitalize";
import ImageEditor from "../../../common/ImageEditor";
import { toast } from "react-toastify";
import ActionButtons from "../../../common/ActionButtons";
import { MdBlock } from "react-icons/md";

const Profile = () => {
  const { person, editPerson, getCurrentPerson, deletePerson } = useContext(PersonContext);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const { form, setForm, handleChange, handleSave, isLoading } =
    useProfileUpdate(person, editPerson, setEditing, getCurrentPerson);

  useEffect(() => {
    getCurrentPerson();
  }, []);

  if (!form) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  // Only show delete if NOT admin
  const showDelete = person?.role !== "admin";

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    // If you want a custom confirmation modal, implement it here.
    // For now, just proceed as before:
    const res = await deletePerson();
    if (res.success) {
      toast.success(res.message || "Account deleted successfully.");
      navigate(`/login/${person?.role}`, { replace: true });
    } else {
      toast.error(res.message || "Failed to delete account.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <BackButton className={person?.role === "customer" ? "border-green-500 hover:bg-green-700" : "border-purple-500 hover:bg-purple-700"} />

      {/* Action Buttons */}
      <div className="mt-4 mb-6 flex justify-between items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">{capitalize(person?.role)} Profile</h2>
      </div>

      {/* Profile Image Editor */}
      <div className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 flex flex-col md:flex-row gap-8 mb-8">
        {/* Profile Image Editor always visible */}
        <ImageEditor
          heading="Profile Image"
          person={person}
          getCurrentPerson={getCurrentPerson}
          type="profile"
          editing={true} // Always allow image update/remove
        />
      </div>

      <div className="mb-4">
        <ActionButtons
          editing={editing}
          isLoading={isLoading}
          onEdit={() => setEditing(true)}
          onCancel={() => {
            setForm(JSON.parse(JSON.stringify(person)));
            setEditing(false);
          }}
          onSave={async () => {
            const result = await handleSave();
            if (result?.success) {
              toast.success(result.message || "Profile updated successfully.");
            } else if (result?.message) {
              toast.error(result.message);
            }
          }}
        />
      </div>

      {/* Basic Info */}
      <div className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 flex flex-col md:flex-row gap-8 mb-8">
        {/* Basic Info Fields */}
        <div className="flex-1 space-y-4 w-full">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileSections[0].fields.map((field, idx) => {
              const isEmail = field.name === "email";
              return (
                <InputField
                  key={idx}
                  label={`${field.label}${field.required ? " *" : ""}`}
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={field.name.split(".").reduce((obj, key) => obj?.[key] ?? "", form)}
                  onChange={handleChange}
                  disabled={!editing || isEmail}
                />
              );
            })}
            {/* GST Number only for vendor */}
            {person?.role === "vendor" && (
              <>
              <InputField
                label="GST Number"
                title="Can't change GST Number"
                name="gstNumber"
                type="text"
                placeholder="Enter your GST Number"
                value={form.gstNumber || ""}
                onChange={handleChange}
                disabled={true}
              />
              <InputField
                label="Company Name"
                title="Can change for first time only"
                name="companyName"
                type="text"
                placeholder="Enter your Company Name"
                value={form.companyName || ""}
                onChange={handleChange}
                disabled={!editing || person?.companyNameLocked}
              />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 mt-8">
        <h3 className="text-lg font-semibold mb-4">Address Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profileSections[1].fields.map((field, idx) => (
            <InputField
              key={idx}
              label={`${field.label}${field.required ? " *" : ""}`}
              name={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={field.name.split(".").reduce((obj, key) => obj?.[key] ?? "", form)}
              onChange={handleChange}
              disabled={!editing}
            />
          ))}
        </div>
      </div>

      {/* Delete Account Button */}
      {showDelete && (
        <Button
          icon={person.role === "vendor" ? MdBlock : FiTrash2}
          text={person.role === "vendor" ? "Disable Account" : "Delete Account"}
          className="mt-6 py-3"
          color="red"
          onClick={handleDelete}
        />
      )}
    </div>
  );
};

export default Profile;