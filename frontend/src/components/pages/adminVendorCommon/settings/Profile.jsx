import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonContext from "../../../../context/person/PersonContext";
import BackButton from "../../../common/layout/BackButton";
import InputField from "../../../common/InputField";
import { profileSections } from "./data/profileFields";
import { FiEdit, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import Loader from "../../../common/Loader";
import useProfileUpdate from "../../../../hooks/useProfileUpdate";
import Button from "../../../common/Button";
import { capitalize } from "../../../../utils/capitalize";

const Profile = () => {
  const { person, editPerson, getCurrentPerson, deletePerson } = useContext(PersonContext);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const { form, setForm, handleChange, handleSave, isLoading, setImageFile } =
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
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const res = await deletePerson(); // res is already JSON parsed object
      if (res.success) {
        alert(res.message);
        // Redirect after successful deletion
        navigate(`/login/${person.role}`, { replace: true });
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      {/* Action Buttons */}
      <div className="mt-4 mb-6 flex justify-between items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">{capitalize(person?.role)} Profile</h2>

        <div className="flex justify-end gap-4">
          {editing ? (
            <>
              <Button
                icon={FiX}
                text="Cancel"
                onClick={() => {
                  setForm(JSON.parse(JSON.stringify(person)));
                  setEditing(false);
                }}
                disabled={isLoading}
                className="py-2 border-red-600 text-red-600"
                color="red"
              />
              <Button
                icon={FiCheck}
                text={isLoading ? "Saving..." : "Save"}
                onClick={handleSave}
                disabled={isLoading}
                className="py-2 border-green-600 text-green-600"
                color="green"
              />
            </>
          ) : (
            <Button icon={FiEdit} text="Edit" className="py-2 border-blue-500 text-blue-600" onClick={() => setEditing(true)} />
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 flex flex-col md:flex-row gap-8">
        {/* Profile Image */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border flex items-center justify-center group">
            {form.profileImage ? (
              <>
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover cursor-pointer group-hover:opacity-70 transition"
                  onClick={() => editing && document.getElementById("profileImageInput").click()}
                  title={editing ? "Click to change image" : ""}
                />
                {editing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      id="profileImageInput"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const tempUrl = URL.createObjectURL(file);
                          setForm((prev) => ({ ...prev, profileImage: tempUrl }));
                          setImageFile(file);
                        }
                      }}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
                      onClick={() => document.getElementById("profileImageInput").click()}
                      title="Click to change image"
                    >
                      <span className="text-white text-sm">Change Image</span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <span className="text-gray-600">No Image</span>
            )}
          </div>
          {/* Remove Profile Image button below the circle */}
          {editing && form.profileImage && (
            <Button
              text="Remove Profile Image"
              color="red"
              className="mt-2 py-1 px-3 text-xs border-red-600 text-red-600 bg-white bg-opacity-80"
              onClick={() => {
                setForm((prev) => ({ ...prev, profileImage: "" }));
                setImageFile(null);
              }}
            />
          )}
        </div>

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
        <Button icon={FiTrash2} text="Delete Account" className="mt-8 py-3 border-red-600 text-red-600 hover:bg-red-600" onClick={handleDelete} />
      )}

    </div>
  );
};

export default Profile;