import React from "react";
import ReactPaginate from "react-paginate";
import PropTypes from "prop-types";

/**
 * Reusable Pagination component powered by `react-paginate`.
 *
 * Props:
 *  - totalItems (number)     : total number of records (required)
 *  - itemsPerPage (number)   : number of items per page (required)
 *  - currentPage (number)    : 1-based current page index (required)
 *  - onPageChange (function) : (selectedPageIndex:number) => void  (required)
 *  - pageRange (number)      : pages shown around current (default 2)
 *  - marginPages (number)    : pages shown at start/end   (default 1)
 */
export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  pageRange = 2,
  marginPages = 1,
}) {
  const pageCount = Math.ceil(totalItems / itemsPerPage) || 1;

  const safeForcePage = Math.min(Math.max(currentPage - 1, 0), pageCount - 1);

  return (
    <ReactPaginate
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageCount={pageCount}
      forcePage={safeForcePage} // ✅ handles zero pages safely
      onPageChange={({ selected }) => onPageChange(selected + 1)} // 0-index → 1-index
      pageRangeDisplayed={pageRange}
      marginPagesDisplayed={marginPages}
      containerClassName="flex gap-0.5 md:gap-3 justify-center items-center text-sm"
      pageClassName="cursor-pointer px-3 py-1 rounded font-semibold hover:bg-blue-100 transition duration-150"
      activeClassName="bg-blue-500 text-white font-bold"
      previousClassName="px-2 py-1 rounded font-semibold"
      nextClassName="px-2 py-1 rounded font-semibold"
      previousLinkClassName="text-gray-600 hover:bg-blue-100 px-2 py-1 rounded block transition duration-150 cursor-pointer"
      nextLinkClassName="text-gray-600 hover:bg-blue-100 px-2 py-1 rounded block transition duration-150 cursor-pointer"
      disabledClassName="opacity-50"
      disabledLinkClassName="cursor-not-allowed pointer-events-none text-gray-400"
      breakClassName="px-2 text-gray-400 font-semibold"
      renderOnZeroPageCount={null}
    />
  );
}

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired, // ✅ 1-indexed for consistency
  onPageChange: PropTypes.func.isRequired,
  pageRange: PropTypes.number,
  marginPages: PropTypes.number,
};
