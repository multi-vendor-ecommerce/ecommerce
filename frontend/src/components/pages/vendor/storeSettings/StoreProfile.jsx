import { useContext, useState } from "react";
import PersonContext from "../../../../context/person/PersonContext";
import VendorContext from "../../../../context/vendors/VendorContext";
import Loader from "../../../common/Loader";
import Button from "../../../common/Button";
import BackButton from "../../../common/layout/BackButton";
import InputField from "../../../common/InputField";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import useProfileUpdate from "../../../../hooks/useProfileUpdate";

const StoreProfile = () => {
  const { person, getCurrentPerson } = useContext(PersonContext);
  const { editStore, loading } = useContext(VendorContext);

  const [editing, setEditing] = useState(false);

  const {
    form,
    setForm,
    handleChange,
    handleSave,
    isLoading,
    setImageFile,
  } = useProfileUpdate(person, editStore, setEditing, getCurrentPerson, "shopLogo");

  if (!person || !form) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <div className="mt-4 mb-6 flex justify-between items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Store Profile</h2>

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
                disabled={loading || isLoading}
                className="py-2 border-red-600 text-red-600"
                color="red"
              />
              <Button
                icon={FiCheck}
                text={loading || isLoading ? "Saving..." : "Save"}
                onClick={handleSave}
                disabled={loading || isLoading}
                className="py-2 border-green-600 text-green-600"
                color="green"
              />
            </>
          ) : (
            <Button
              icon={FiEdit}
              text="Edit"
              className="py-2 border-blue-500 text-blue-600"
              onClick={() => setEditing(true)}
            />
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 flex flex-col justify-center gap-5">
        {/* Store Logo */}
        <div className="flex-shrink-0 flex flex-col justify-center  gap-3">
          <h3 className="font-medium">Shop Logo *</h3>

          <div className="flex flex-col items-center gap-3">
            <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-200 border flex items-center justify-center">
              {form.shopLogo ? (
                <img
                  src={form.shopLogo}
                  alt="Store Logo"
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
                        setForm((prev) => ({ ...prev, shopLogo: tempUrl }));
                        setImageFile(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Upload Shop Logo"
                  />
                  <span className="text-gray-500 text-sm text-center px-2">Click to add logo</span>
                </>
              ) : (
                <span className="text-gray-600">No Logo</span>
              )}

            </div>
            <p className="text-sm text-yellow-500">Maximum upload size: 5 MB (JPG, PNG, or WebP)</p>
          </div>
        </div>

        {/* Shop Name */}
        <div className="flex-1 space-y-4 w-full">
          <InputField
            label="Shop Name *"
            name="shopName"
            type="text"
            placeholder="Enter shop name"
            value={form.shopName || ""}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreProfile;