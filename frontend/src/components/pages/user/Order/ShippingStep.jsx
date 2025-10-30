import { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import AddressContext from "../../../../context/shippingAddress/AddressContext";
import StepperControls from "../../../common/StepperControls";
import Loader from "../../../common/Loader";
import InputField from "../../../common/InputField";

const ShippingStep = ({ order, setOrder, step, next, prev }) => {
  const { addresses, getAddresses, deleteAddress, setDefaultAddress, addAddress, updateAddress, loading } =
    useContext(AddressContext);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",
    line1: "",
    line2: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Load addresses on mount
  useEffect(() => {
    getAddresses();
  }, []);

  // Prefill default or order.saved shipping info
  useEffect(() => {
    if (order?.shippingInfo?._id) {
      setSelectedAddress(order.shippingInfo);
    } else {
      const defaultAddr = addresses.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
    }
  }, [order, addresses]);

  useEffect(() => {
    if (order?.shippingInfo?._id) {
      setSelectedAddress(order.shippingInfo);
    }
  }, [order?.shippingInfo]);

  const handleSelect = (address) => {
    setSelectedAddress(address);
    setOrder((prev) => ({
      ...prev,
      shippingInfo: address,
    }));
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(addressId);
      if (selectedAddress?._id === addressId) {
        setSelectedAddress(null);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    await setDefaultAddress(addressId);
    const defaultAddr = addresses.find((a) => a._id === addressId);
    if (defaultAddr) setSelectedAddress(defaultAddr);
  };

  const resetForm = () => {
    setFormData({
      recipientName: "",
      recipientPhone: "",
      line1: "",
      line2: "",
      locality: "",
      city: "",
      state: "",
      pincode: "",
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isEditing && editId) {
      // Update existing
      await updateAddress(editId, formData);
    } else {
      // Add new
      await addAddress(formData);
    }
    resetForm();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#2E7D32] mb-4">Shipping Information</h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader />
        </div>
      ) : addresses?.length === 0 ? (
        <p>No saved addresses. Please add one below.</p>
      ) : (
        <div className="space-y-2">
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => handleSelect(address)}
              className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition-all duration-200 shadow-sm border 
                ${selectedAddress?._id === address._id
                  ? "border-[#2E7D32] bg-[#E8F5E9] scale-[1.02]"
                  : "border-gray-200 bg-white hover:border-[#2E7D32]/50 hover:shadow-md"
                }`}
            >
              {/* Address Info */}
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-[#2E7D32]">
                  {address.recipientName} • {address.recipientPhone}
                </p>
                <p className="text-gray-700 text-sm leading-snug">
                  {address.line1}, {address.line2 && `${address.line2}, `}
                  {address.locality}, {address.city}, {address.state} - {address.pincode}
                </p>
                {address.isDefault && (
                  <span className="inline-block text-xs text-green-700 font-medium bg-green-100 px-2 py-[2px] rounded mt-1">
                    Default
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-end gap-1 ml-4">
                {!address.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(address._id);
                    }}
                    className="text-[#2E7D32] bg-green-50 hover:bg-green-100 border border-green-200 px-2 py-[5px] rounded-md text-sm font-medium transition-all"
                  >
                    Set Default
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(address);
                      setEditId(address._id);
                      setIsEditing(true);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-white bg-[#2E7D32] hover:bg-[#256D2A] font-medium text-sm transition-all duration-200 hover:scale-[1.03]"
                  >
                    <FaEdit size={13} />
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address._id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-red-600 bg-red-50 hover:bg-red-100 font-medium text-sm transition-all duration-200 hover:scale-[1.03]"
                  >
                    <FaTrashAlt size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </div>

          ))}
        </div>
      )}

      {/* Add Address button (only if less than 3) */}
      {addresses.length < 3 && !showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setFormData({
              recipientName: "",
              recipientPhone: "",
              line1: "",
              line2: "",
              locality: "",
              city: "",
              state: "",
              pincode: "",
            });
          }}
          className="w-full border-2 border-[#2E7D32] text-[#2E7D32] py-2 rounded-lg font-semibold hover:bg-[#E8F5E9] hover:shadow-md transition-all"

        >
          + Add New Address
        </button>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="space-y-3 border border-[#C8E6C9] p-6 rounded-xl bg-[#F9FFF9] shadow-sm">

          <InputField
            label="Recipient Name"
            name="recipientName"
            placeholder="Recipient Name"
            value={formData.recipientName}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Phone"
            name="recipientPhone"
            placeholder="Phone"
            value={formData.recipientPhone}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Line 1"
            name="line1"
            placeholder="Line 1"
            value={formData.line1}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Line 2"
            name="line2"
            placeholder="Line 2"
            value={formData.line2}
            onChange={handleInputChange}
          />
          <InputField
            label="Locality"
            name="locality"
            placeholder="Locality"
            value={formData.locality}
            onChange={handleInputChange}
          />
          <InputField
            label="City"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="State"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Pincode"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            required
          />

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-[#2E7D32] text-white px-6 py-2 rounded-lg shadow hover:bg-[#256D2A] transition-all"
            >

              {isEditing ? "Update Address" : "Save Address"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition-all"
            >

              Cancel
            </button>
          </div>
        </form>
      )}

      <StepperControls
        currentStep={step}
        onNext={next}
        onBack={prev}
        showSubmit={!!selectedAddress}
      />
    </div>
  );
};

export default ShippingStep;
