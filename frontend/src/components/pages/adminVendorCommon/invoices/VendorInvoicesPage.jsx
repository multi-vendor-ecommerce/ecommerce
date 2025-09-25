import { getFormatDate } from "../../../../utils/formatDate";
import { useContext, useEffect, useState } from "react";
import InvoiceContext from "../../../../context/invoices/InvoiceContext";
import Loader from "../../../common/Loader";
import { NavLink, useParams } from "react-router-dom";
import BackButton from "../../../common/layout/BackButton";

const VendorInvoicesPage = () => {
  const { invoiceId } = useParams();
  const { getInvoiceById, loading } = useContext(InvoiceContext);

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const fetchedInvoice = await getInvoiceById(invoiceId);
      setInvoice(fetchedInvoice);
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading && !invoice) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <h2 className="text-xl font-semibold mt-4 mb-6 truncate">
        Vendor Invoices for Order #{invoice?._id}
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {invoice?.vendorInvoices.map((vi, index) => (
          <div
            key={vi.vendorId?._id || index}
            className="rounded-xl shadow-md hover:shadow-blue-500 transition duration-300 bg-white p-6 flex flex-col justify-between"
          >
            <div>
              <NavLink to={`/admin/vendor/profile/${vi.vendorId?._id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                {vi.vendorId?.name || "N/A"}
              </NavLink>
              <div className="text-gray-600 mb-1">
                <span className="font-medium">Email:</span> {vi.vendorId?.email || "N/A"}
              </div>
              <div className="text-gray-600 mb-1">
                <span className="font-medium">Shop:</span> {vi.vendorId?.shopName || "N/A"}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {vi?.invoiceUrl ? (
                <a
                  href={vi?.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline font-semibold"
                >
                  View Invoice
                </a>
              ) : (
                <span className="text-gray-400">No Invoice Available</span>
              )}
              <span className="text-sm text-gray-500">
                {getFormatDate(vi.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VendorInvoicesPage;