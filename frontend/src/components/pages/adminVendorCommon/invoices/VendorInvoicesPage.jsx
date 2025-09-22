// import { getFormatDate } from "../../../../utils/formatDate";
// import { useContext, useEffect } from "react";
// import InvoiceContext from "../../../../context/invoices/InvoiceContext";

// const VendorInvoicesPage = () => {
//   const { invoiceID } = useParams();
//   const { invoices, getAllInvoices } = useContext(InvoiceContext);

//   useEffect(() => {
//     getAllInvoices();
//   }, []);

//   if (!invoices?.length) return <div>No invoices found.</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Vendor Invoices for Order {invoices._id}</h2>
//       <table className="min-w-full border border-gray-200">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="px-4 py-2">Vendor Name</th>
//             <th className="px-4 py-2">Vendor Email</th>
//             <th className="px-4 py-2">Shop Name</th>
//             <th className="px-4 py-2">Invoice</th>
//             <th className="px-4 py-2">Invoice Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {vendorInvoices.map((vi, index) => (
//             <tr
//               key={vi.vendorId?._id || index}
//               className="border-t border-gray-200 hover:bg-blue-50"
//             >
//               <td className="px-4 py-2">{vi.vendorId?.name || "N/A"}</td>
//               <td className="px-4 py-2">{vi.vendorId?.email || "N/A"}</td>
//               <td className="px-4 py-2">{vi.vendorId?.shopName || "N/A"}</td>
//               <td className="px-4 py-2">
//                 {vi.invoiceUrl ? (
//                   <a
//                     href={vi.invoiceUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-green-600 hover:underline cursor-pointer"
//                   >
//                     View Invoice
//                   </a>
//                 ) : (
//                   "N/A"
//                 )}
//               </td>
//               <td className="px-4 py-2">{getFormatDate(vi.createdAt)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default VendorInvoicesPage;
import React from 'react'

const VendorInvoicesPage = () => {
  return (
    <div>VendorInvoicesPage</div>
  )
}

export default VendorInvoicesPage