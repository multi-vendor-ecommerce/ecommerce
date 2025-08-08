import { useContext, useEffect, useState } from "react";
import PersonContext from "../../../../context/person/PersonContext";
import BackButton from "../../../common/layout/BackButton";
import InputField from "../../../common/InputField";
import { profileSections } from "./data/profileFields";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";

const Profile = () => {
  const { person, getCurrentPerson } = useContext(PersonContext);
  const [form, setForm] = useState(null); // initially null
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getCurrentPerson();
  }, []);

  useEffect(() => {
    if (person) {
      setForm(JSON.parse(JSON.stringify(person)));
    }
  }, [person]);

  if (!form) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length === 1) {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => {
        const updated = { ...prev };
        let obj = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        return updated;
      });
    }
  };

  const handleSave = () => {
    console.log("Saving profile...", form);
    setEditing(false);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <div className="mt-4 mb-6 flex justify-between items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Profile</h2>
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} type="button" className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-red-600 hover:bg-red-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer">
                <FiX className="text-lg md:text-xl" />
                <span className="hidden md:inline-block">Cancel</span>
              </button>
              <button onClick={handleSave} type="button" className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-green-600 hover:bg-green-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer">
                <FiCheck className="text-lg md:text-xl" />
                <span className="hidden md:inline-block">Save</span>
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} type="button" className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer">
              <FiEdit className="text-lg md:text-xl" />
              <span className="hidden md:inline-block">Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Top Section: Image + Basic Info */}
        <div className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200 flex flex-col md:flex-row items-start gap-8 ">
          {/* Profile Image */}
          <div className="flex-shrink-0 self-center md:self-start">
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">No Image</span>
              </div>
            )}
          </div>

          {/* Basic Information Section */}
          <div className="flex-1 space-y-4 w-full">
            <h3 className="text-lg font-semibold pb-1">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileSections[0].fields.map((field, idx) => (
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
        </div>

        {/* Address Section */}
        <div className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200 space-y-4">
          <h3 className="text-lg font-semibold pb-1">Address Details</h3>
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
      </div>
    </div>
  );
};

export default Profile;
