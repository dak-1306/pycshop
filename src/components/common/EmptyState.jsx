import React from "react";

const EmptyState = ({
  title = "Chưa có sản phẩm",
  description = "Bạn chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên của bạn!",
  actionText = "Thêm sản phẩm",
  onAction,
  icon,
}) => {
  const defaultIcon = (
    <svg
      className="w-16 h-16 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l5-3v12m0-12l6 3v12"
      />
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* Icon */}
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        {icon || defaultIcon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-center mb-8 max-w-md">{description}</p>

      {/* Action Button */}
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <svg
            className="w-5 h-5 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
