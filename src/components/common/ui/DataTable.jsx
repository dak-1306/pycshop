import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionButton } from "./";

/**
 * Generic DataTable component for displaying tabular data
 * Used by ProductTable, OrderTable, and other data tables
 */
const DataTable = React.memo(
  ({
    data = [],
    columns = [],
    emptyState = null,
    variant = "seller",
    onRowAction,
    getStatusColor,
    className = "",
  }) => {
    // Defensive check for data array
    const safeData = Array.isArray(data) ? data : [];

    // Default empty state
    const defaultEmptyState = {
      icon: ["fas", "box-open"],
      title: "Chưa có dữ liệu",
      description: "Danh sách sẽ hiển thị ở đây",
    };

    const finalEmptyState = { ...defaultEmptyState, ...emptyState };

    // Show empty state if no data
    if (safeData.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <FontAwesomeIcon
            icon={finalEmptyState.icon}
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {finalEmptyState.title}
          </h3>
          <p className="text-gray-500">{finalEmptyState.description}</p>
        </div>
      );
    }

    // Status color helper
    const getStatusColorInternal = (status, type = "default") => {
      if (getStatusColor) return getStatusColor(status, type);

      // Default status colors for different types
      const statusMap = {
        // Product status
        product: {
          active: "bg-green-100 text-green-800",
          inactive: "bg-red-100 text-red-800",
          pending: "bg-yellow-100 text-yellow-800",
          draft: "bg-gray-100 text-gray-800",
          out_of_stock: "bg-orange-100 text-orange-800",
        },
        // Order status
        order: {
          completed: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          processing: "bg-blue-100 text-blue-800",
          cancelled: "bg-red-100 text-red-800",
        },
        // Payment status
        payment: {
          paid: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          failed: "bg-red-100 text-red-800",
        },
      };

      return statusMap[type]?.[status] || "bg-gray-100 text-gray-800";
    };

    // Render cell content based on column type
    const renderCell = (item, column) => {
      const value = column.accessor ? item[column.accessor] : item;

      switch (column.type) {
        case "image":
          return (
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <img
                  className="h-10 w-10 rounded-lg object-cover border"
                  src={
                    column.getImageUrl
                      ? column.getImageUrl(item)
                      : value || "/images/placeholder-product.png"
                  }
                  alt={column.alt || "Image"}
                  onError={(e) => {
                    e.target.src = "/images/placeholder-product.png";
                  }}
                />
              </div>
              {column.showDetails && (
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {column.getTitle ? column.getTitle(item) : item.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {column.getSubtitle
                      ? column.getSubtitle(item)
                      : `#${item.id}`}
                  </div>
                </div>
              )}
            </div>
          );

        case "avatar":
          return (
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={["fas", "user"]}
                    className="w-5 h-5 text-gray-500"
                  />
                </div>
              </div>
              {column.showDetails && (
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {column.getTitle ? column.getTitle(item) : value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {column.getSubtitle ? column.getSubtitle(item) : ""}
                  </div>
                </div>
              )}
            </div>
          );

        case "currency":
          return (
            <div className="text-sm font-semibold text-gray-900">
              {column.format ? column.format(value, item) : value}
            </div>
          );

        case "status":
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColorInternal(
                value,
                column.statusType || "default"
              )}`}
            >
              {column.getStatusText ? column.getStatusText(value, item) : value}
            </span>
          );

        case "date":
          return (
            <span className="text-xs text-gray-500">
              {column.format
                ? column.format(value, item)
                : value
                ? new Date(value).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
                : "-"}
            </span>
          );

        case "actions":
          return (
            <div className="flex items-center space-x-1">
              {column.actions.map((action, actionIndex) => {
                // Skip action if shouldShow function returns false
                if (action.shouldShow && !action.shouldShow(item)) {
                  return null;
                }

                return (
                  <ActionButton
                    key={actionIndex}
                    action={action.type}
                    onClick={() =>
                      onRowAction && onRowAction(action.type, item)
                    }
                    role={variant}
                    size="xs"
                    title={action.title}
                  >
                    {action.label}
                  </ActionButton>
                );
              })}
            </div>
          );

        case "text":
        default:
          return (
            <div className="text-sm text-gray-900">
              {column.format ? column.format(value, item) : value || "-"}
            </div>
          );
      }
    };

    // Filter columns based on variant
    const visibleColumns = columns.filter(
      (column) => !column.adminOnly || variant === "admin"
    );

    return (
      <div
        className={`bg-white rounded-xl shadow-sm border overflow-hidden ${className}`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {visibleColumns.map((column, index) => {
                  // Define responsive column widths using valid Tailwind classes
                  const getColumnWidth = (column, index) => {
                    if (column.type === "image") return "min-w-40 w-40"; // Product with image
                    if (column.type === "actions") return "min-w-32 w-32"; // Actions
                    if (column.header === "Danh mục") return "min-w-20 w-24";
                    if (column.header === "Người bán") return "min-w-24 w-28";
                    if (column.header === "Giá") return "min-w-20 w-24";
                    if (column.header === "Tồn kho") return "min-w-16 w-20";
                    if (column.header === "Trạng thái") return "min-w-24 w-28";
                    if (column.header === "Ngày tạo") return "min-w-20 w-24";
                    return "min-w-0";
                  };

                  return (
                    <th
                      key={index}
                      className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${getColumnWidth(
                        column,
                        index
                      )}`}
                    >
                      {column.header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeData.map((item, index) => (
                <tr
                  key={item.id || `row-${index}`}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {visibleColumns.map((column, columnIndex) => (
                    <td
                      key={columnIndex}
                      className={`px-3 py-3 ${
                        column.nowrap ? "whitespace-nowrap" : "break-words"
                      }`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

DataTable.displayName = "DataTable";

DataTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      type: PropTypes.oneOf([
        "text",
        "image",
        "avatar",
        "currency",
        "status",
        "date",
        "actions",
      ]),
      nowrap: PropTypes.bool,
      adminOnly: PropTypes.bool,
      format: PropTypes.func,
      getImageUrl: PropTypes.func,
      getTitle: PropTypes.func,
      getSubtitle: PropTypes.func,
      getStatusText: PropTypes.func,
      showDetails: PropTypes.bool,
      statusType: PropTypes.string,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          title: PropTypes.string,
          shouldShow: PropTypes.func,
        })
      ),
    })
  ),
  emptyState: PropTypes.shape({
    icon: PropTypes.array,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  variant: PropTypes.oneOf(["admin", "seller"]),
  onRowAction: PropTypes.func,
  getStatusColor: PropTypes.func,
  className: PropTypes.string,
};

export default DataTable;
