import { useState, useEffect, useContext } from "react";
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
      <h2 className="text-xl font-bold">Shipping Information</h2>

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
              className={`p-3 border rounded cursor-pointer flex justify-between items-start ${selectedAddress?._id === address._id
                ? "border-green-700 bg-green-50"
                : ""
                }`}
            >
              <div className="flex flex-col space-y-1">
                <p className="font-semibold">
                  {address.recipientName}, {address.recipientPhone}
                </p>
                <p>
                  {address.line1}, {address.line2}, {address.locality},{" "}
                  {address.city}, {address.state}, {address.pincode}
                </p>
              </div>
              <div className="flex flex-col space-y-1 text-sm">
                {!address.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(address._id);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(address._id);
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData(address);
                    setEditId(address._id);
                    setIsEditing(true);
                    setShowForm(true);
                  }}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </button>
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
          className="w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
        >
          + Add New Address
        </button>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="space-y-2 border p-4 rounded">
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
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {isEditing ? "Update Address" : "Save Address"}
            </button>
            <button type="button" onClick={resetForm} className="border px-4 py-2 rounded">
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
