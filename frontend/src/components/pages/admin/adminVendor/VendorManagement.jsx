import { useState } from "react";
import { dummyVendors } from "./data/dummyVendorsData";
import { renderVendorRow } from "./renderVendorRow";
import TabularData from "../../../common/TabularData";

const VendorManagement = () => {
  const [vendors, setVendors] = useState(dummyVendors);

  const toggleStatus = (id) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: v.status === "active" ? "inactive" : "active" }
          : v
      )
    );
  };

  const headers = ["Vendor", "Email", "Shop", "Products", "Total Sales", "Commission", "Registered On", "Status", "Actions"];

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">All Vendors</h2>

      <TabularData
        headers={headers}
        data={vendors}
        renderRow={(v, i) => renderVendorRow(v, i, toggleStatus)}
        emptyMessage="No vendors found."
      />
    </section>
  );
};

export default VendorManagement;
