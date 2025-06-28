import { customersDummy } from "./data/customersData";

const Customers = () => {
  return (
    <section className="bg-gray-100 min-h-screen p-6 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Customers</h2>

      <div className="bg-white shadow-md shadow-blue-500 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-gray-600">
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
                  className={`hover:bg-blue-50 hover:shadow-sm transition ${i !== 0 ? "border-t border-gray-200" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-4 hover:scale-105 transition duration-150 cursor-pointer group">
                    <img src={c.avatar} alt={`${c.avatar} profile`} className="w-10 rounded-full object-cover shadow-md shadow-gray-400 scale-105 transition duration-150" />
                    <span className="group-hover:font-semibold">{c.name}</span>
                  </td>
                  <td className="px-4 py-3 hover:scale-105 transition duration-150">{c.email}</td>
                  <td className="px-4 py-3 hover:scale-105 transition duration-150">{c.location}</td>
                  <td className="px-4 py-3 hover:scale-105 transition duration-150">{c.totalOrders}</td>
                  <td className="px-4 py-3 hover:scale-105 transition duration-150">₹{c.totalValue.toLocaleString()}</td>
                  <td className="px-4 py-3 hover:scale-105 transition duration-150">{c.registeredOn}</td>
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
