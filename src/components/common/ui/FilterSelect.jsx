import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FilterSelect = ({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  gradientFrom = "blue-400",
  gradientTo = "blue-600",
  focusColor = "blue-500",
  className = "",
}) => {
  // Build class names using proper concatenation for Tailwind compilation
  const gradientClass = `absolute inset-0 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200`;
  const focusRingClass = `focus:ring-${focusColor}`;
  const focusBorderClass = `focus:border-${focusColor}`;
  const hoverBorderClass = `hover:border-${focusColor.replace("-500", "-300")}`;

  return (
    <div className={`relative group ${className}`}>
      <div className={gradientClass}></div>
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`relative bg-white border border-gray-300 rounded-lg px-3 py-2 pr-7 text-sm focus:outline-none focus:ring-2 ${focusRingClass} ${focusBorderClass} transition-all duration-200 ${hoverBorderClass} appearance-none cursor-pointer`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <FontAwesomeIcon
          icon={["fas", "chevron-down"]}
          className="w-3 h-3 text-gray-400"
        />
      </div>
    </div>
  );
};

FilterSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  gradientFrom: PropTypes.string,
  gradientTo: PropTypes.string,
  focusColor: PropTypes.string,
  className: PropTypes.string,
};

export default FilterSelect;
