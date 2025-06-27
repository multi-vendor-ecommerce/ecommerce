import React from "react";
import { customersDummy } from "./data/customersData";

const Customers = () => {
  return (
    <section className="bg-gray-100 min-h-screen p-6 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Customers</h2>

      <div className="bg-white shadow-md shadow-blue-500 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-gray-600">
          <thead className="bg-gray-50 uppercase text-sm text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total Orders</th>
              <th className="px-4 py-3">Order Value (₹)</th>
              <th className="px-4 py-3">Date Registered</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {customersDummy.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              customersDummy.map((c, i) => (
                <tr
                  key={i}
                  className={`hover:bg-blue-50 hover:shadow-sm transition ${
                    i !== 0 ? "border-t border-gray-200" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.totalOrders}</td>
                  <td className="px-4 py-3">₹{c.totalValue.toLocaleString()}</td>
                  <td className="px-4 py-3">{c.registeredOn}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Customers;
