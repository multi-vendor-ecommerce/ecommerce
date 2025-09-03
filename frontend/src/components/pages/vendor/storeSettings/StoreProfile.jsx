import { useContext, useEffect, useState } from "react";
import PersonContext from "../../../../context/person/PersonContext";
import VendorContext from "../../../../context/vendors/VendorContext";
import Loader from "../../../common/Loader";
import BackButton from "../../../common/layout/BackButton";
import InputField from "../../../common/InputField";
import useProfileUpdate from "../../../../hooks/useProfileUpdate";
import ImageEditor from "../../../common/ImageEditor";
import { toast } from "react-toastify";
import ActionButtons from "../../../common/ActionButtons";

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
  } = useProfileUpdate(person, editStore, setEditing, getCurrentPerson);

  if (!person || !form) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Map shopLogo fields to ImageEditor props
  const shopLogoPerson = {
    shopLogo: person.shopLogo,
    shopLogoId: person.shopLogoId,
    _id: person?._id,
  };

  // Wrap handleSave to show toast
  const handleSaveWithToast = async () => {
    const result = await handleSave();
    if (result?.success) {
      toast.success(result.message || "Store profile updated successfully.");
    } else if (result?.message) {
      toast.error(result.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <div className="mt-4 mb-6 flex justify-between items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Store Profile</h2>
      </div>

      {/* Basic Info */}
      <div className="bg-white mb-8 px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 flex flex-col justify-center gap-5">
        {/* Shop Logo using ImageEditor */}
        <ImageEditor
          heading="Shop Logo"
          person={shopLogoPerson}
          getCurrentPerson={getCurrentPerson}
          type="shopLogo"
          editing={true}
        />
      </div>

      <ActionButtons
        editing={editing}
        isLoading={isLoading}
        onEdit={() => setEditing(true)}
        onCancel={() => {
          setForm(JSON.parse(JSON.stringify(person)));
          setEditing(false);
        }}
        onSave={handleSaveWithToast}
      />

      {/* Shop Name */}
      <div className="bg-white mt-4 px-4 py-6 rounded-xl shadow-md hover:shadow-blue-500 flex flex-col justify-center gap-5">
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