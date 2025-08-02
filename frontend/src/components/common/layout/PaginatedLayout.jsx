import Pagination from "./Pagination";
import ItemsPerPageSelector from "./ItemsPerPageSelector";

const PaginatedLayout = ({
  children,
  totalItems = 0,
  itemsPerPage = 10,
  currentPage = 1, // Note: 1-indexed for consistency
  onPageChange,
  onItemsPerPageChange,
}) => {
  return (
    <>
      {children()}
      <div className="flex justify-between items-center gap-2 mt-6 flex-wrap">
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
        />
      </div>
    </>
  );
};

export default PaginatedLayout;
