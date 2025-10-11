import React from "react";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  variant = "seller", // "admin" | "seller"
  placeholder,
  className = "",
}) => {
  // Default placeholders based on variant
  const defaultPlaceholder =
    variant === "admin"
      ? "Tìm kiếm trong toàn hệ thống..."
      : "Tìm kiếm sản phẩm...";

  // Colors based on variant
  const colors =
    variant === "admin"
      ? {
          gradient: "from-blue-400 to-blue-600",
          focus: "focus:ring-blue-500",
          button: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
        }
      : {
          gradient: "from-orange-400 to-orange-600",
          focus: "focus:ring-orange-500",
          button: "text-green-600 hover:text-green-700 hover:bg-green-50",
        };

  return (
    <div className={`mb-8 ${className}`}>
      <div className="relative max-w-lg mx-auto">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-lg transform rotate-1 opacity-20`}
        ></div>
        <div className="relative bg-white rounded-lg shadow-md">
          <input
            type="text"
            placeholder={placeholder || defaultPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-6 pr-14 py-4 border-0 rounded-lg focus:outline-none focus:ring-2 ${colors.focus} text-gray-700 placeholder-gray-400 text-lg`}
          />
          <button
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 ${colors.button} rounded-full transition-colors`}
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
