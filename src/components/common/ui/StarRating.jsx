import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = "sm",
  showNumber = true,
  showTotal = false,
  totalReviews = 0,
  className = "",
  interactive = false,
  onRatingChange = null,
}) => {
  const safeRating = Math.max(0, Math.min(rating, maxStars));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  // Size configurations
  const sizeConfig = {
    xs: {
      iconSize: "text-xs",
      textSize: "text-xs",
      spacing: "space-x-0.5",
    },
    sm: {
      iconSize: "text-sm",
      textSize: "text-sm",
      spacing: "space-x-1",
    },
    md: {
      iconSize: "text-base",
      textSize: "text-base",
      spacing: "space-x-1",
    },
    lg: {
      iconSize: "text-lg",
      textSize: "text-lg",
      spacing: "space-x-1",
    },
    xl: {
      iconSize: "text-xl",
      textSize: "text-xl",
      spacing: "space-x-2",
    },
    "2xl": {
      iconSize: "text-2xl",
      textSize: "text-2xl",
      spacing: "space-x-2",
    },
  };

  const config = sizeConfig[size] || sizeConfig.sm;

  const handleStarClick = (index) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const renderStar = (type, index) => {
    const isClickable = interactive && onRatingChange;
    const baseClasses = `${config.iconSize} transition-colors duration-200`;

    let colorClasses = "";
    let icon = "";

    switch (type) {
      case "full":
        colorClasses = "text-yellow-400";
        icon = ["fas", "star"];
        break;
      case "half":
        colorClasses = "text-yellow-400";
        icon = ["fas", "star-half-alt"];
        break;
      case "empty":
        colorClasses = "text-gray-300";
        icon = ["far", "star"];
        break;
    }

    if (isClickable) {
      colorClasses += " hover:text-yellow-500 cursor-pointer";
    }

    return (
      <FontAwesomeIcon
        key={`${type}-${index}`}
        icon={icon}
        className={`${baseClasses} ${colorClasses}`}
        onClick={() => handleStarClick(index)}
      />
    );
  };

  return (
    <div className={`flex items-center ${config.spacing} ${className}`}>
      {/* Stars container */}
      <div className={`flex items-center ${config.spacing}`}>
        {/* Full stars */}
        {Array.from({ length: fullStars }, (_, index) =>
          renderStar("full", index)
        )}

        {/* Half star */}
        {hasHalfStar && renderStar("half", fullStars)}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }, (_, index) =>
          renderStar("empty", fullStars + (hasHalfStar ? 1 : 0) + index)
        )}
      </div>

      {/* Rating number */}
      {showNumber && (
        <span className={`${config.textSize} text-gray-600 font-medium ml-1`}>
          {safeRating.toFixed(1)}
        </span>
      )}

      {/* Total reviews */}
      {showTotal && totalReviews > 0 && (
        <span className={`${config.textSize} text-gray-500 ml-1`}>
          ({totalReviews} đánh giá)
        </span>
      )}
    </div>
  );
};

// Preset components for common use cases
export const ProductRating = ({
  rating,
  reviewCount,
  size = "sm",
  className = "",
}) => (
  <StarRating
    rating={rating}
    size={size}
    showNumber={true}
    showTotal={true}
    totalReviews={reviewCount}
    className={className}
  />
);

export const SimpleStars = ({ rating, size = "sm", className = "" }) => (
  <StarRating
    rating={rating}
    size={size}
    showNumber={false}
    showTotal={false}
    className={className}
  />
);

export const InteractiveRating = ({
  rating,
  onRatingChange,
  size = "md",
  className = "",
}) => (
  <StarRating
    rating={rating}
    size={size}
    showNumber={true}
    showTotal={false}
    interactive={true}
    onRatingChange={onRatingChange}
    className={className}
  />
);

StarRating.propTypes = {
  rating: PropTypes.number,
  maxStars: PropTypes.number,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "2xl"]),
  showNumber: PropTypes.bool,
  showTotal: PropTypes.bool,
  totalReviews: PropTypes.number,
  className: PropTypes.string,
  interactive: PropTypes.bool,
  onRatingChange: PropTypes.func,
};

ProductRating.propTypes = {
  rating: PropTypes.number,
  reviewCount: PropTypes.number,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "2xl"]),
  className: PropTypes.string,
};

SimpleStars.propTypes = {
  rating: PropTypes.number,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "2xl"]),
  className: PropTypes.string,
};

InteractiveRating.propTypes = {
  rating: PropTypes.number,
  onRatingChange: PropTypes.func,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "2xl"]),
  className: PropTypes.string,
};

export default StarRating;
