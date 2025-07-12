// Products.jsx
import { useContext, useEffect } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import TabularData from "../../../common/layout/TabularData";
import { RenderProductRow } from "./RenderProductRow";
import Spinner from "../../../common/Spinner";

export default function Products({ heading }) {
  const context = useContext(ProductContext);
  const { products, getAllProducts, loading } = context;

  useEffect(() => {
    getAllProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  const maxUnitsSold = Math.max(...products.map((p) => p.unitsSold));
  const topProducts = [...products].filter(p => p.approved).sort((a, b) => b.unitsSold - a.unitsSold);

  const headers = ["Product", "ID", "Category", "Price", "Units Sold", "Revenue", "Approval Status", "Sales Progress", "Actions"];

  return (
    <section className="bg-gray-100 min-h-screen p-6 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">{heading}</h2>

      <PaginatedLayout data={heading === "Top Selling Products" ? topProducts : products} initialPerPage={10}>
        {(currentItems) => (
          <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden">
            <TabularData
              headers={headers}
              data={currentItems}
              renderRow={(p, i) => RenderProductRow(p, i, maxUnitsSold)}
              emptyMessage="No products available."
            />
          </div>
        )}
      </PaginatedLayout>
    </section>
  );
}
