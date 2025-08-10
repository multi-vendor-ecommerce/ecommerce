import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonContext from "../../../../context/person/PersonContext";
import BackButton from "../../../common/layout/BackButton";
import InputField from "../../../common/InputField";
import { profileSections } from "./data/profileFields";
import { FiEdit, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import Loader from "../../../common/Loader";
import useProfileUpdate from "../../../../hooks/useProfileUpdate";

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
        <h2 className="text-xl md:text-2xl font-bold">Profile</h2>
        <div className="flex justify-end gap-4">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setForm(JSON.parse(JSON.stringify(person)));
                  setEditing(false);
                }}
                className="flex items-center gap-2 px-3 py-2 border border-red-600 hover:bg-red-600 text-black font-semibold hover:text-white rounded-lg transition cursor-pointer"
              >
                <FiX size={19} />
                <span className="hidden md:inline-block">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 border border-green-600 hover:bg-green-600 text-black font-semibold hover:text-white rounded-lg transition cursor-pointer"
              >
                <FiCheck size={19} />
                {isLoading ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-3 py-2 border border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white rounded-lg transition cursor-pointer"
            >
              <FiEdit size={19} />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 flex flex-col md:flex-row gap-8">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border flex items-center justify-center">
            {form.profileImage ? (
              <img src={form.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : editing ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const tempUrl = URL.createObjectURL(file);
                      setForm((prev) => ({ ...prev, profileImage: tempUrl }));
                      setImageFile(file);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Upload Profile Image"
                />
                <span className="text-gray-500 text-sm text-center px-2">Click to add image</span>
              </>
            ) : (
              <span className="text-gray-600">No Image</span>
            )}
          </div>
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
        <h3 className="text-lg font-semibold">Address Details</h3>
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
        <div className="mt-8">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-3 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition cursor-pointer"
          >
            <FiTrash2 size={20} />
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;