import Pagination from "./Pagination";
import ItemsPerPageSelector from "./ItemsPerPageSelector";
import { useState } from "react";

const PaginatedLayout = ({ data, initialPerPage = 10, children }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(initialPerPage);

  const safeData = data || []; // fallback if undefined

  const startIndex = currentPage * itemsPerPage;
  const currentItems = safeData.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(0);
  };

  return (
    <>
      {children(currentItems)}
      <div className="flex justify-between items-center gap-2 mt-6 flex-wrap">
        <Pagination
          totalItems={safeData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
      </div>
    </>
  );
};

export default PaginatedLayout;
