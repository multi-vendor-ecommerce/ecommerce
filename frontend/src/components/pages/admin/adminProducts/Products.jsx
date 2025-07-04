// Products.jsx
import { productsData } from "./data/productsData";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import { RenderProductRow } from "./RenderProductRow";

export default function Products({ heading }) {
  const headers = ["Product", "ID", "Category", "Units Sold", "Revenue", "Sales Progress", "Actions"];

  return (
    <section className="bg-gray-100 min-h-screen p-6 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">{heading}</h2>

      <PaginatedLayout data={productsData} initialPerPage={10}>
        {(currentItems) => (
          <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden">
            <TabularData
              headers={headers}
              data={currentItems}
              renderRow={(p, i) => RenderProductRow(p, i)}
              emptyMessage="No products available."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}
