import { useContext, useEffect, useState } from "react";
import PersonContext from "../../../../context/person/PersonContext";
import BackButton from "../../../common/layout/BackButton";
import InputField from "../../../common/InputField";
import { profileSections } from "./data/profileFields";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import Spinner from "../../../common/Spinner";

const Profile = () => {
  const { person, getCurrentPerson, editPerson } = useContext(PersonContext);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    getCurrentPerson();
  }, []);

  useEffect(() => {
    if (person) {
      setForm(JSON.parse(JSON.stringify(person)));
    }
  }, [person]);

  if (!form) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

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

  const handleSave = async () => {
    const formData = new FormData();

    const appendNested = (obj, parentKey = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof value === "object" && value !== null && !(value instanceof File)) {
          appendNested(value, fullKey);
        } else {
          formData.append(fullKey, value);
        }
      });
    };

    const formCopy = { ...form };
    delete formCopy.email;
    appendNested(formCopy);

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    const res = await editPerson(formData);

    if (res.success) {
      alert("Profile updated successfully.");
      getCurrentPerson();
    } else {
      alert(res.message || "Failed to update profile.");
    }

    setEditing(false);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <div className="mt-4 mb-6 flex justify-between items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Profile</h2>
        <div className="flex justify-end gap-4">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                type="button"
                className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-red-600 hover:bg-red-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
              >
                <FiX className="text-lg md:text-xl" />
                <span className="hidden md:inline-block">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                type="button"
                className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-green-600 hover:bg-green-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
              >
                <FiCheck className="text-lg md:text-xl" />
                <span className="hidden md:inline-block">Save</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              type="button"
              className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
            >
              <FiEdit className="text-lg md:text-xl" />
              <span className="hidden md:inline-block">Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 transition duration-200 flex flex-col md:flex-row items-start gap-8">
          <div className="flex-shrink-0 self-center md:self-start">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border flex items-center justify-center">
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
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
                  <span className="text-gray-500 text-sm text-center px-2">
                    Click to add image
                  </span>
                </>
              ) : (
                <span className="text-gray-600">No Image</span>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <h3 className="text-lg font-semibold pb-1">Basic Information</h3>
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