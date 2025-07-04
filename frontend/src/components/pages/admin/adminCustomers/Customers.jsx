import { useState } from "react";
import { customersDummy } from "./data/customersData";
import Pagination from "../../../common/Pagination";
import ItemsPerPageSelector from "../../../common/ItemsPerPageSelector";

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const start = currentPage * itemsPerPage;
  const currentItems = customersDummy.slice(start, start + itemsPerPage);

  // When itemsPerPage changes, reset to first page
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(0);
  };

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Customers</h2>

      <div className="bg-white shadow-md shadow-blue-500 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-screen text-left text-gray-600">
          <thead className="bg-gray-50 uppercase text-sm text-gray-500">
            <tr>
              {["Customer", "Email", "Location", "Total Orders", "Total Value", "Registered On"].map((header) => (
                <th key={header} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              currentItems.map((c, i) => (
                <tr
                  key={i}
                  className={`hover:bg-blue-50 hover:shadow-sm transition ${i !== 0 ? "border-t border-gray-200" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-4 hover:scale-105 transition duration-150 cursor-pointer group">
                    <img
                      src={c.avatar}
                      alt={`${c.name} profile`}
                      className="hidden md:inline-block w-10 h-10 rounded-full object-cover shadow-md shadow-purple-400 scale-105 transition duration-150"
                    />
                    <span className="group-hover:font-semibold">{c.name}</span>
                  </td>
                  {[c.email, c.location, c.totalOrders, c.totalValue.toLocaleString(), c.registeredOn].map((cInfo, index) => {
                    return <td key={index} className="px-4 py-3 hover:scale-105 transition duration-150">{cInfo}</td>
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center gap-2 mt-6 flex-wrap">
        <Pagination
          totalItems={customersDummy.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
      </div>
    </section>
  );
};

export default Customers;
