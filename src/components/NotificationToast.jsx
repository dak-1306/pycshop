import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "../context/NotificationContext.jsx";

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    const iconMap = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    };
    return iconMap[type] || "bell";
  };

  const getStyles = (type) => {
    const styleMap = {
      success: "bg-green-500 border-green-600",
      error: "bg-red-500 border-red-600",
      warning: "bg-yellow-500 border-yellow-600",
      info: "bg-blue-500 border-blue-600",
    };
    return styleMap[type] || "bg-gray-500 border-gray-600";
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`min-w-80 max-w-md rounded-lg shadow-lg border-l-4 ${getStyles(
            notification.type
          )} bg-white text-gray-800 animate-fade-in-right`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FontAwesomeIcon
                  icon={["fas", getIcon(notification.type)]}
                  className={`w-5 h-5 ${
                    notification.type === "success"
                      ? "text-green-500"
                      : notification.type === "error"
                      ? "text-red-500"
                      : notification.type === "warning"
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }`}
                />
              </div>
              <div className="ml-3 flex-1">
                {notification.title && (
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {notification.title}
                  </h4>
                )}
                <p className="text-sm text-gray-700">{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
                >
                  <FontAwesomeIcon
                    icon={["fas", "times"]}
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
