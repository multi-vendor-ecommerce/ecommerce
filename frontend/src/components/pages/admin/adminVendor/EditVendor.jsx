import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCheckCircle, FiUnlock } from "react-icons/fi";
import CustomSelect from "../../../common/layout/CustomSelect";
import { vendorFilterFields } from "./data/vendorFilterFields";
import VendorContext from "../../../../context/vendors/VendorContext";
import BackButton from "../../../common/layout/BackButton";
import StatusChip from "../../../common/helperComponents/StatusChip";
import Button from "../../../common/Button";
import InputField from "../../../common/InputField";
import ActionButtons from "../../../common/ActionButtons";
import useProfileUpdate from "../../../../hooks/useProfileUpdate";
import Loader from "../../../common/Loader";
import { MdBlock } from "react-icons/md";
import { updateVendorFields } from "./data/updateVendorFields";

const EditVendor = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { getVendorById, updateVendorStatus, adminEditVendor } = useContext(VendorContext);

  const [vendor, setVendor] = useState(null);
  const [status, setStatus] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      const data = await getVendorById(vendorId);
      setVendor(data);
    };
    fetchVendor();
  }, [getVendorById, vendorId]);

  // use reusable hook for commissionRate + gstNumber
  const {
    form,
    setForm,
    handleChange,
    handleSave,
    isLoading,
    hasChanges,
    hasEmptyRequired, // <-- add this from updated hook
  } = useProfileUpdate(vendor, adminEditVendor, setEditing, () => getVendorById(vendorId));

  const handleStatusChange = async (id) => {
    if (!status || status === vendor?.status) {
      toast.info("Status is already set to this value. No changes made.");
      return;
    }

    setUpdatingId(id);
    const data = await updateVendorStatus(id, status);
    setUpdatingId(null);

    if (data?.success) {
      setVendor((prev) => ({ ...prev, status }));
      toast.success(data.message || `Vendor ${status} successfully!`);
    } else {
      toast.error(data.message || "Failed to update vendor status.");
    }
  };

  const filterFields = vendorFilterFields[1].options.filter(
    (field) => field.value !== "pending" && field.value !== "" && field.value !== "inactive"
  );

  const handleSaveButton = async () => {
    if (!hasChanges) {
      toast.info("No changes to save.");
      setEditing(false);
      return;
    }
    if (hasEmptyRequired) {
      toast.error("Please fill all required fields.");
      return;
    }
    const result = await handleSave();
    if (result?.success) {
      setVendor((prev) => ({
        ...prev,
        commissionRate: form.commissionRate,
        gstNumber: form.gstNumber,
      }));
      setEditing(false);
    }
  };

  const handleDisable = async () => {
    const res = await updateVendorStatus(vendorId, "inactive");
    if (res?.success) {
      toast.success(res.message || "Account disabled.");
      navigate("/admin/all-vendors");
    } else {
      toast.error(res?.message || "Failed to disable account.");
    }
  };

  const handleEnable = async () => {
    const res = await updateVendorStatus(vendorId, "active");
    if (res?.success) {
      toast.success(res.message || "Account enabled.");
      navigate("/admin/all-vendors");
    } else {
      toast.error(res?.message || "Failed to enable account.");
    }
  };

  if (!form) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <section aria-label="Admin Dashboard" className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <h2 className="text-2xl font-bold mt-4 mb-6">Edit Vendor</h2>

      {/* Vendor Status */}
      <div className="flex flex-col gap-3 bg-white shadow-md rounded-xl p-6">
        <div className="flex gap-2 justify-between items-center">
          <h3 className="inline font-semibold">Vendor Status</h3>
          <span className="flex gap-2 items-center">
            Current <StatusChip status={vendor?.status} />
          </span>
        </div>

        <CustomSelect
          options={filterFields}
          value={status}
          onChange={(newValue) => setStatus(newValue)}
          menuPlacement="auto"
        />
      </div>

      <Button
        icon={FiCheckCircle}
        text={"Update Status"}
        onClick={() => handleStatusChange(vendorId)}
        className="mt-4 py-2"
        disabled={!status || status === vendor?.status || updatingId === vendorId}
      />

      {/* Editable Fields */}
      <div className="flex flex-col mt-8 gap-3 bg-white shadow-md rounded-xl p-6">
        {updateVendorFields.map((field) => (
          <InputField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            title={field.title}
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 items-center mt-4">
        <ActionButtons
          editing={editing}
          isLoading={isLoading}
          onEdit={() => setEditing(true)}
          onCancel={() => {
            setForm(JSON.parse(JSON.stringify(vendor)));
            setEditing(false);
          }}
          onSave={handleSaveButton}
          disableSave={!hasChanges || hasEmptyRequired} // <-- updated here
        />

        {/* Disable Account Button */}
        <Button
          icon={vendor.status === "inactive" ? FiUnlock : MdBlock}
          text={vendor.status === "inactive" ? "Enable Account" : "Disable Account"}
          className="py-2"
          color={vendor.status === "inactive" ? "green" : "red"}
          disabled={editing}
          onClick={vendor.status === "inactive" ? handleEnable : handleDisable}
        />
      </div>
    </section>
  );
};

export default EditVendor;