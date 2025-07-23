import { useState, useEffect, useContext } from "react";
import VendorContext from "../../../../context/vendors/VendorContext";
import { NavLink } from "react-router-dom";
import TabularData from "../../../common/layout/TabularData";
import { RenderVendorRow } from "../adminVendor/RenderVendorRow";
import ShowLessMore from "../../../common/helperComponents/ShowLessMore";
import Spinner from "../../../common/Spinner";

const TopVendors = () => {
  const { vendors, getAllVendors, loading } = useContext(VendorContext);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getAllVendors();
  }, []);

  const sortedVendors = [...vendors].sort((a, b) => b.totalSales - a.totalSales);
  const vendorsToShow = showAll ? sortedVendors : sortedVendors.slice(0, 5);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      {loading ?
        <div className="flex justify-center">
          <Spinner />
        </div>
        :
        <div>
          <div className="min-h-16 flex justify-between items-center mb-5">
            <h2 className="textxl md:text-2xl font-bold text-gray-800">Top Vendors</h2>
            <NavLink
              to="/admin/top-vendors"
              className="border-gray-300 px-2 md:px-4 py-2 rounded-xl text-sm md:text-[16px] font-medium text-black hover:text-blue-500 border-2 hover:border-blue-500 transition cursor-pointer"
            >
              View Vendors
            </NavLink>
          </div>

          <div>
            <TabularData
              headers={["Vendor", "Email", "Shop", "Products", "Total Sales", "Commission", "Registered On", "Status", "Actions"]}
              data={vendorsToShow}
              renderRow={(p, i) => RenderVendorRow(p, i)}
              emptyMessage="No vendors found."
              widthClass="w-full"
            />
          </div>

          <ShowLessMore showAll={showAll} toggleShowAll={() => setShowAll((prev) => !prev)} condition={vendors.length > 5} />
        </div>}
    </section>
  )
}

export default TopVendors;