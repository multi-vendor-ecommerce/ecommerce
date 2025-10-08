// src/components/common/TabularData.jsx
import React from "react";

/**
 * Generic, unopinionated table wrapper.
 *
 * @param {string[]} headers      – column labels
 * @param {Array<any>} data       – array of whatever each screen needs
 * @param {(row: any, index: number) => React.ReactNode} renderRow
 * @param {string} emptyMessage
 * @param {string} widthClass     – Tailwind width (default w-screen)
 */
const TabularData = ({
  headers = [],
  data = [],
  renderRow,
  emptyMessage = "No records found.",
  widthClass = "w-screen",
}) => {
  return (
    <div className="overflow-x-auto">
      <table className={`${widthClass} table-auto text-left text-sm text-gray-600`}>
        {/* ── HEAD ─────────────────────────────────────────────── */}
        <thead className="bg-gray-50 text-gray-500 uppercase">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-3 min-w-[100px]">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── BODY ─────────────────────────────────────────────── */}
        <tbody className="bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="py-10 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => renderRow(row, idx))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabularData;
