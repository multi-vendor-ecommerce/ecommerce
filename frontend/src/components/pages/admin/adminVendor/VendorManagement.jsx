import { useState } from "react";
import { dummyVendors } from "./data/dummyVendorsData";
import { renderVendorRow } from "./renderVendorRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";

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

      <PaginatedLayout data={vendors} initialPerPage={10}>
        {(currentItems) => (
          <div className="overflow-hidden bg-white shadow-md shadow-blue-500 rounded-xl border border-gray-200">
            <TabularData
              headers={headers}
              data={currentItems}
              renderRow={(v, i) => renderVendorRow(v, i, toggleStatus)}
              emptyMessage="No vendors found."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
};

export default VendorManagement;

