import { useContext, useState } from "react";
import PersonContext from "../../../../context/person/PersonContext";
import VendorContext from "../../../../context/vendors/VendorContext";
import Loader from "../../../common/Loader";
import Button from "../../../common/Button";
import BackButton from "../../../common/layout/BackButton";
import InputField from "../../../common/InputField";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import useProfileUpdate from "../../../../hooks/useProfileUpdate";
import ImageEditor from "../../adminVendorCommon/settings/ImageEditor"; // <-- Import ImageEditor

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

  // Map shopLogo fields to ImageEditor props
  const shopLogoPerson = {
    profileImage: form.shopLogo,
    profileImageId: form.shopLogoId,
    _id: person._id,
  };

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
                onClick={async () => {
                  const result = await handleSave();
                  if (result?.success && result.vendor) {
                    setForm(result.vendor);
                    setImageFile(null);
                    setEditing(false);
                  }
                }}
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
        {/* Shop Logo using ImageEditor */}
        <ImageEditor
          heading="Shop Logo"
          person={shopLogoPerson}
          getCurrentPerson={getCurrentPerson}
        />

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