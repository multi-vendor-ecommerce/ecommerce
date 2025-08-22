import { useState, useEffect, useContext } from "react";
import AddressContext from "../../../../context/shippingAddress/AddressContext";

const ShippingStep = ({ order, setOrder, onNext }) => {
  const { addresses, getAddresses, deleteAddress, setDefaultAddress, addAddress, updateAddress } =
    useContext(AddressContext);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 👈 track add vs edit
  const [editId, setEditId] = useState(null); // 👈 current editing addressId
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

  const handleConfirm = () => {
    if (!selectedAddress) return alert("Please select an address");
    onNext();
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

      {addresses?.length === 0 ? (
        <p>No saved addresses. Please add one below.</p>
      ) : (
        <div className="space-y-2">
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => handleSelect(address)}
              className={`p-3 border rounded cursor-pointer flex justify-between items-start ${selectedAddress?._id === address._id
                ? "border-purple-700 bg-purple-50"
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
          <input
            type="text"
            placeholder="Recipient Name"
            value={formData.recipientName}
            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.recipientPhone}
            onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Line 1"
            value={formData.line1}
            onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Line 2"
            value={formData.line2}
            onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Locality"
            value={formData.locality}
            onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <div className="flex space-x-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {isEditing ? "Update Address" : "Save Address"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ShippingStep;
