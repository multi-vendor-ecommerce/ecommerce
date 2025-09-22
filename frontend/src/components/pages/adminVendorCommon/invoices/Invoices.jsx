import { useContext, useEffect, useState } from "react";
import InvoiceContext from "../../../../context/invoices/InvoiceContext";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import { RenderInvoiceRow } from "./RenderInvoiceRow";
import Loader from "../../../common/Loader";
import FilterBar from "../../../common/FilterBar";
import BackButton from "../../../common/layout/BackButton";
import { NavLink } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { invoiceFilterFields } from "./data/invoiceFilterFields";

export default function Invoices({ role = "admin" }) {
  const { invoices, getAllInvoices, totalCount, loading } = useContext(InvoiceContext);
  const [filters, setFilters] = useState({ search: "" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getAllInvoices();
  }, []);

  const handleChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setPage(1);
    if (isTopSellingPage) {
      fetchTopSelling(1, itemsPerPage);
    } else {
      fetchPaginatedProducts(1, itemsPerPage);
    }
  };

  const handleClear = () => {
    const reset = { search: "" };
    setFilters(reset);
    setPage(1);

    getAllInvoices();
  };

  const handlePageChange = (pg) => {
    setPage(pg);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setPage(1); // Reset to first page on limit change
  };

  if (loading && invoices.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  const headers = [
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
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <BackButton />
        <NavLink
          to={`/${role}/all-orders`}
          className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-blue-600 font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
        >
          <FiEye className="text-lg md:text-2xl" />
          <span className="hidden md:inline-block">Check All Orders</span>
        </NavLink>
      </div>

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mt-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">All Invoices</h2>
        <FilterBar
          fields={invoiceFilterFields}
          values={filters}
          onChange={handleChange}
          onApply={handleApply}
          onClear={handleClear}
        />
      </div>

      <PaginatedLayout
        totalItems={totalCount}
        currentPage={page}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      >
        {() => (
          <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden">
            <TabularData
              headers={headers}
              data={invoices}
              renderRow={(invoice, i) => RenderInvoiceRow(invoice, i, role)}
              emptyMessage="No invoices available."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}
