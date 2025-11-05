import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FilterContainer = ({
  children,
  hasActiveFilters = false,
  onResetFilters,
  actionButtons = [],
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-4 mb-6 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {children}

          {/* Reset Button */}
          {hasActiveFilters && onResetFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Đặt lại bộ lọc"
            >
              <FontAwesomeIcon
                icon={["fas", "rotate-left"]}
                className="w-4 h-4"
              />
              <span className="text-sm">Đặt lại</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        {actionButtons.length > 0 && (
          <div className="flex space-x-2">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`group relative flex items-center gap-1.5 px-4 py-2 ${
                  button.className ||
                  "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                } rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg overflow-hidden`}
                title={button.title}
              >
                {button.icon && (
                  <FontAwesomeIcon icon={button.icon} className="w-4 h-4" />
                )}
                <span>{button.label}</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

FilterContainer.propTypes = {
  children: PropTypes.node.isRequired,
  hasActiveFilters: PropTypes.bool,
  onResetFilters: PropTypes.func,
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.array,
      className: PropTypes.string,
      title: PropTypes.string,
    })
  ),
  className: PropTypes.string,
};

export default FilterContainer;
