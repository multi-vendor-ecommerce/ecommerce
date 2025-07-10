import { useState, useCallback } from "react";
import VendorContext from "./VendorContext";

const NoteState = (props) => {
  const [vendors, setVendors] = useState([]);

  const host = "http://localhost:5000";
  
  const getAllVendors = async () => {
    try {
      const response = await fetch(`${host}/api/vendors`);
      if (!response.ok) {
        throw new Error('Failed to fetch vendors.');
      }

      const data = await response.json();
      setVendors(data.vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  }

  const getVendorById = useCallback(async (id) => {
    try {
      const response = await fetch(`${host}/api/vendors/${id}`);
      if (!response.ok) throw new Error("Failed to fetch the vendor.");

      const data = await response.json();
      return data.vendor;
    } catch (error) {
      console.error("Error fetching vendor:", error);
    }
  }, [host]);

  return (
    <VendorContext.Provider value={{ vendors, getAllVendors, getVendorById }}>
      {props.children}
    </VendorContext.Provider>
  )
}

export default NoteState;