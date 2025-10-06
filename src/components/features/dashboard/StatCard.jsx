import React from "react";
import PropTypes from "prop-types";
import { Card } from "../../ui";

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon,
  loading = false,
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeIcon = (type) => {
    if (type === "increase") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    }
    if (type === "decrease") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 text-orange-600">{icon}</div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>

      {change && (
        <div className={`mt-4 flex items-center ${getChangeColor(changeType)}`}>
          {getChangeIcon(changeType)}
          <span className="text-sm font-medium ml-2">{change}</span>
        </div>
      )}
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  changeType: PropTypes.oneOf(["increase", "decrease", "neutral"]),
  icon: PropTypes.node,
  loading: PropTypes.bool,
};

export default StatCard;
