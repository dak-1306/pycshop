import React from "react";

const ChartLoadingPlaceholder = ({ title, type = "bar" }) => {
  const renderChartIcon = (type) => {
    switch (type) {
      case "bar":
        return (
          <svg
            className="w-8 h-8 text-gray-400 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "pie":
        return (
          <svg
            className="w-8 h-8 text-gray-400 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        );
      case "line":
        return (
          <svg
            className="w-8 h-8 text-gray-400 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-8 h-8 text-gray-400 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
      </div>

      <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 animate-pulse">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-sm">
            {renderChartIcon(type)}
          </div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-2"></div>
          <div className="h-2 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
      </div>
    </div>
  );
};

export default ChartLoadingPlaceholder;
