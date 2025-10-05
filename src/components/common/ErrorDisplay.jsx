import React from "react";

const ErrorDisplay = ({
  error,
  onRetry,
  title = "Có lỗi xảy ra",
  showRetry = true,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      {/* Error Icon */}
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Error Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Error Message */}
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {error || "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau."}
      </p>

      {/* Retry Button */}
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <svg
            className="w-4 h-4 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
