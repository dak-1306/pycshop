import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Button, Badge } from "../../ui";
import EmptyState from "../EmptyState";

const DataTable = ({
  data = [],
  columns = [],
  actions = [],
  loading = false,
  pagination,
  onSort,
  emptyState,
  className = "",
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const SortIcon = ({ direction }) => {
    if (!direction) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return (
      <svg
        className={`w-4 h-4 ${
          direction === "asc" ? "text-orange-500" : "text-orange-500 rotate-180"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-300 h-12 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-300 h-16 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return <EmptyState {...emptyState} />;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <SortIcon
                        direction={
                          sortConfig?.key === column.key
                            ? sortConfig.direction
                            : null
                        }
                      />
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(row[column.key], row, index)
                      : row[column.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {actions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant={action.variant || "outline"}
                          onClick={() => action.onClick(row)}
                          disabled={action.disabled?.(row)}
                        >
                          {action.icon && (
                            <span className="mr-1">{action.icon}</span>
                          )}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={pagination.onPrevious}
              disabled={!pagination.hasPrevious}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              onClick={pagination.onNext}
              disabled={!pagination.hasNext}
            >
              Tiếp
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{pagination.from}</span>{" "}
                đến <span className="font-medium">{pagination.to}</span> trong{" "}
                <span className="font-medium">{pagination.total}</span> kết quả
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pagination.onPrevious}
                  disabled={!pagination.hasPrevious}
                  className="rounded-r-none"
                >
                  Trước
                </Button>

                {pagination.pages?.map((page, idx) => (
                  <Button
                    key={idx}
                    variant={page.active ? "primary" : "outline"}
                    size="sm"
                    onClick={() => pagination.onPageChange(page.number)}
                    className="rounded-none"
                  >
                    {page.number}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={pagination.onNext}
                  disabled={!pagination.hasNext}
                  className="rounded-l-none"
                >
                  Tiếp
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.string,
      disabled: PropTypes.func,
      icon: PropTypes.node,
    })
  ),
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  onSort: PropTypes.func,
  emptyState: PropTypes.object,
  className: PropTypes.string,
};

export default DataTable;
