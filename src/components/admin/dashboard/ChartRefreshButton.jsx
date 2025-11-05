import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

const ChartRefreshButton = ({ onRefresh, isLoading = false }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || isLoading) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Error refreshing charts:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing, isLoading]);

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing || isLoading}
      className={`
        inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm 
        leading-4 font-medium rounded-md text-gray-700 bg-white 
        hover:bg-gray-50 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-blue-500 transition-colors
        ${isRefreshing || isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <svg
        className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
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
      {isRefreshing ? "Đang cập nhật..." : "Cập nhật dữ liệu"}
    </button>
  );
};

ChartRefreshButton.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default React.memo(ChartRefreshButton);
