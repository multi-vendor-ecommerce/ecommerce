import { useState } from "react";
import Pagination from "../../../common/Pagination";
import ItemsPerPageSelector from "../../../common/ItemsPerPageSelector";
import { productsData } from "./data/productsData";
import ProductsDetails from "./ProductsDetails";

export default function Products({ heading }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const startIndex = currentPage * itemsPerPage;
  const currentItems = productsData.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(0);
  };

  return (
    <section className="bg-gray-100 min-h-screen p-6 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">{heading}</h2>

      <div className="bg-white shadow-md overflow-x-auto rounded-xl border border-gray-200 shadow-blue-500">
        <ProductsDetails currentItems={currentItems} />
      </div>

      <div className="flex justify-between items-center gap-2 mt-6 flex-wrap">
        <Pagination
          totalItems={productsData.length}
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
}
