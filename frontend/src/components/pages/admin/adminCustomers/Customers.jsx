// components/admin/customers/Customers.jsx
import { useContext, useEffect } from "react";
import UserContext from "../../../../context/user/UserContext";
import { RenderCustomerRow } from "./RenderCustomerRow";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import Spinner from "../../../common/Spinner";

const Customers = () => {
  const { users, getAllCustomers, loading } = useContext(UserContext);

  useEffect(() => {
    getAllCustomers();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }
  
  const headers = ["Customer", "Email", "Location", "Total Orders", "Total Value", "Registered On"];

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Customers</h2>

      <PaginatedLayout data={users} initialPerPage={10}>
        {(currentItems) => (
          <div className="overflow-hidden bg-white shadow-md shadow-blue-500 rounded-xl border border-gray-200">
            <TabularData
              headers={headers}
              data={currentItems}
              renderRow={RenderCustomerRow}
              emptyMessage="No customers found."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
};

export default Customers;
