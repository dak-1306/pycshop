import React from "react";
import PropTypes from "prop-types";
import { Button } from "../../ui";

const EmptyState = ({
  title = "Chưa có dữ liệu",
  description = "Không có dữ liệu để hiển thị.",
  actionText = "Thêm mới",
  onAction,
  icon,
  size = "md",
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

  const sizes = {
    sm: {
      container: "py-8 px-4",
      iconContainer: "w-16 h-16 mb-4",
      title: "text-lg",
      description: "text-sm",
    },
    md: {
      container: "py-16 px-6",
      iconContainer: "w-24 h-24 mb-6",
      title: "text-xl",
      description: "text-base",
    },
    lg: {
      container: "py-24 px-8",
      iconContainer: "w-32 h-32 mb-8",
      title: "text-2xl",
      description: "text-lg",
    },
  };

  const currentSize = sizes[size];

  return (
    <div
      className={`flex flex-col items-center justify-center ${currentSize.container}`}
    >
      {/* Icon */}
      <div
        className={`${currentSize.iconContainer} bg-gray-100 rounded-full flex items-center justify-center`}
      >
        {icon || defaultIcon}
      </div>

      {/* Title */}
      <h3
        className={`${currentSize.title} font-semibold text-gray-900 mb-2 text-center`}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={`${currentSize.description} text-gray-600 text-center mb-8 max-w-md`}
      >
        {description}
      </p>

      {/* Action Button */}
      {onAction && actionText && (
        <Button onClick={onAction} variant="primary">
          <svg
            className="w-5 h-5 mr-2"
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
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.node,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default EmptyState;
