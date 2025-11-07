import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = ({
  searchTerm,
  setSearchTerm = () => {},
  variant = "seller", // "admin" | "seller"
  placeholder,
  className = "",
  size = "large", // "large" | "compact" - for filter vs standalone use
  icon = "svg", // "svg" | "fontawesome" - icon type
  debounceMs = 300, // debounce delay in milliseconds
}) => {
  // Internal state for immediate display
  const [internalValue, setInternalValue] = useState(searchTerm || "");

  // Update internal value when searchTerm prop changes
  useEffect(() => {
    setInternalValue(searchTerm || "");
  }, [searchTerm]);

  // Debounced update to parent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (internalValue !== searchTerm) {
        setSearchTerm(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [internalValue, debounceMs, setSearchTerm, searchTerm]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setInternalValue(e.target.value);
  }, []);
  // Default placeholders based on variant
  const defaultPlaceholder =
    variant === "admin"
      ? "Tìm kiếm trong toàn hệ thống..."
      : "Tìm kiếm sản phẩm...";

  // Colors based on variant
  const colors =
    variant === "admin"
      ? {
          gradient: "from-admin-400 to-admin-600",
          focus: "focus:ring-admin-500",
          button: "text-admin-600 hover:text-admin-700 hover:bg-admin-50",
        }
      : {
          gradient: "from-seller-400 to-seller-600",
          focus: "focus:ring-seller-500",
          button: "text-seller-600 hover:text-seller-700 hover:bg-seller-50",
        };

  // Size configurations
  const sizeConfig = {
    large: {
      container: "mb-8",
      wrapper: "max-w-lg mx-auto",
      input: "pl-6 pr-14 py-4 text-lg",
      button: "right-4 p-2",
      icon: "w-6 h-6",
    },
    compact: {
      container: "",
      wrapper: "max-w-none",
      input: "pl-9 pr-3 py-2 text-sm w-64",
      button: "right-2 p-1",
      icon: "w-4 h-4",
    },
  };

  const config = sizeConfig[size] || sizeConfig.large;

  // Render search icon based on type
  const renderIcon = () => {
    if (icon === "fontawesome") {
      const iconColorClass =
        size === "compact"
          ? `text-gray-400 group-focus-within:${
              variant === "admin" ? "text-admin-500" : "text-seller-500"
            }`
          : "";

      return (
        <FontAwesomeIcon
          icon={["fas", "search"]}
          className={`${config.icon} ${iconColorClass}`}
        />
      );
    }

    // Default SVG icon
    return (
      <svg
        className={config.icon}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    );
  };

  if (size === "compact") {
    const hoverBorderColor =
      variant === "admin"
        ? "hover:border-admin-300"
        : "hover:border-seller-300";

    return (
      <div className={`relative group ${className}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {renderIcon()}
        </div>
        <input
          type="text"
          placeholder={placeholder || defaultPlaceholder}
          value={internalValue}
          onChange={handleInputChange}
          className={`${config.input} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${colors.focus} focus:border-transparent transition-all duration-200 ${hoverBorderColor} text-gray-700 placeholder-gray-400`}
        />
      </div>
    );
  }

  return (
    <div className={`${config.container} ${className}`}>
      <div className={`relative ${config.wrapper}`}>
        <div
          className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-lg transform rotate-1 opacity-20`}
        ></div>
        <div className="relative bg-white rounded-lg shadow-md">
          <input
            type="text"
            placeholder={placeholder || defaultPlaceholder}
            value={internalValue}
            onChange={handleInputChange}
            className={`w-full ${config.input} border-0 rounded-lg focus:outline-none focus:ring-2 ${colors.focus} text-gray-700 placeholder-gray-400`}
          />
          <button
            type="button"
            aria-label="Tìm kiếm"
            className={`absolute ${config.button} top-1/2 transform -translate-y-1/2 ${colors.button} rounded-full transition-colors`}
          >
            {renderIcon()}
          </button>
        </div>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  variant: PropTypes.oneOf(["admin", "seller"]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(["large", "compact"]),
  icon: PropTypes.oneOf(["svg", "fontawesome"]),
  debounceMs: PropTypes.number,
};

export default SearchBar;
