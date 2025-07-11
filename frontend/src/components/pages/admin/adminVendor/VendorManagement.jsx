import { useState, useEffect, useContext } from "react";
import VendorContext from "../../../../context/vendors/VendorContext";
import { RenderVendorRow } from "./RenderVendorRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";

const VendorManagement = ({ heading }) => {
  const context = useContext(VendorContext);
  const { vendors, getAllVendors } = context;

  useEffect(() => {
    getAllVendors();
  }, []);

  const headers = ["Vendor", "Email", "Shop", "Products Qty", "Total Sales", "Commission", "Registered On", "Status", "Actions"];

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">{heading}</h2>

      <PaginatedLayout data={vendors} initialPerPage={10}>
        {(currentItems) => (
          <div className="overflow-hidden bg-white shadow-md shadow-blue-500 rounded-xl border border-gray-200">
            <TabularData
              headers={headers}
              data={currentItems}
              renderRow={(v, i) => RenderVendorRow(v, i)}
              emptyMessage="No vendors found."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
};

export default VendorManagement;

