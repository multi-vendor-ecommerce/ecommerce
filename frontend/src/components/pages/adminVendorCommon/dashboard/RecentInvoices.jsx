import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import InvoiceContext from "../../../../context/invoices/InvoiceContext";
import TabularData from "../../../common/layout/TabularData";
import { RenderInvoiceRow } from "../../adminVendorCommon/invoices/RenderInvoiceRow";
import ShowLessMore from "../../../common/helperComponents/ShowLessMore";
import Loader from "../../../common/Loader";

const RecentInvoices = ({ role = "admin" }) => {
  const { invoices, loading } = useContext(InvoiceContext);
  const [showAll, setShowAll] = useState(false);

  const invoicesToShow = showAll ? invoices : invoices.slice(0, 5);

  const headers = [
    "Order Id",
    "Invoice Number",
    "GST / Tax",
    "Total Discount",
    "Grand Total",
    "Payment Method",
    role === "admin" ? "Customer Invoice" : null,
    role === "admin"
      ? (invoices?.vendorInvoices?.length === 1 ? "Vendor Invoice" : "Vendor Invoices")
      : "My Invoice",
    "Created At"
  ].filter(Boolean); // removes any nulls

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      {loading ? (
        <div className="flex justify-center"><Loader /></div>
      ) : (
        <>
          <div className="min-h-16 w-full flex gap-2 justify-between items-center mb-5">
            <h2 className="w-[60%] md:w-auto text-xl md:text-2xl font-bold text-gray-800 truncate">Recent Invoices</h2>
            <NavLink
              to={`/${role}/invoices`}
              className="w-[40%] md:w-auto border-gray-300 px-2 md:px-4 py-2 rounded-xl text-center text-sm md:text-[16px] font-medium text-black hover:text-blue-500 border-2 hover:border-blue-500 transition cursor-pointer"
            >
              View Invoices
            </NavLink>
          </div>

          <div>
            <TabularData
              headers={headers}
              data={invoicesToShow}
              renderRow={(invoice, i) => RenderInvoiceRow(invoice, i, role)}
              emptyMessage="No invoices found."
            />
          </div>

          <ShowLessMore showAll={showAll} toggleShowAll={() => setShowAll((prev) => !prev)} condition={invoices.length > 5} />
        </>
      )}
    </section>
  );
};

export default RecentInvoices;
