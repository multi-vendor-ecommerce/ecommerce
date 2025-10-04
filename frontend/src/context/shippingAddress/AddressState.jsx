// AddressState.jsx
import { useState } from "react";
import AddressContext from "./AddressContext";

const AddressState = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const host = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-psww.onrender.com";
  // const host = "http://localhost:5000";

  // Fetch all addresses for logged-in user
  const getAddresses = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/shipping-address`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
      });

      const data = await response.json();
      if (data.success) setAddresses(data.addresses);
      else setAddresses([]);

    } catch (error) {
      console.error("Error fetching addresses:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single address
  const getAddressById = async (addressId) => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/shipping-address/${addressId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
      });

      const data = await response.json();
      if (data.success) {
        setAddress(data.address);
      }
    } catch (error) {
      console.error("Error fetching address:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // Add address
  const addAddress = async (address) => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/shipping-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();
      if (data.success) {
        setAddresses((prev) => [...prev, data.address]);
      }
    } catch (error) {
      console.error("Error adding address:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update address
  const updateAddress = async (addressId, updatedAddress) => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/shipping-address/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
        body: JSON.stringify(updatedAddress),
      });

      const data = await response.json();
      if (data.success) {
        setAddresses((prev) =>
          prev.map((address) =>
            address._id === addressId ? data.address : address
          )
        );
      }
    } catch (error) {
      console.error("Error updating address:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    try {
      setLoading(true);

      const response = await fetch(`${host}/api/shipping-address/${addressId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
      });

      const data = await response.json();
      if (data.success) {
        setAddresses((prev) => prev.filter((address) => address._id !== addressId));
      }
    } catch (error) {
      console.error("Error deleting address:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(`${host}/api/shipping-address/default/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("customerToken"),
        },
      });

      const data = await response.json();
      if (data.success) {
        setAddresses((prev) =>
          prev.map((address) =>
            address._id === addressId
              ? { ...address, isDefault: true }
              : { ...address, isDefault: false }
          )
        );
      }
    } catch (error) {
      console.error("Error setting default address:", error.message);
    }
  };

  return (
    <AddressContext.Provider
      value={{ address, addresses, loading, getAddresses, getAddressById, addAddress, updateAddress, deleteAddress, setAddresses, setDefaultAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export default AddressState;
