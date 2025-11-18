import { useCallback } from "react";

// Custom hook for toast notifications
export const useToast = () => {
  const showToast = useCallback(
    (message, type = "success", duration = 2000) => {
      // Remove existing toasts
      const existingToasts = document.querySelectorAll(".toast-notification");
      existingToasts.forEach((toast) => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      });

      // Create new toast
      const toast = document.createElement("div");
      toast.className = `toast-notification toast-${type}`;
      toast.textContent = message;

      // Toast styles
      const styles = {
        success: {
          background: "#28a745",
          color: "white",
          icon: "✓",
        },
        error: {
          background: "#dc3545",
          color: "white",
          icon: "✗",
        },
        warning: {
          background: "#ffc107",
          color: "#212529",
          icon: "⚠",
        },
        info: {
          background: "#17a2b8",
          color: "white",
          icon: "i",
        },
      };

      const style = styles[type] || styles.success;

      toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: ${style.background};
      color: ${style.color};
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
      word-wrap: break-word;
    `;

      // Add icon
      const iconSpan = document.createElement("span");
      iconSpan.textContent = style.icon;
      iconSpan.style.cssText = `
      font-weight: bold;
      font-size: 16px;
    `;

      toast.insertBefore(iconSpan, toast.firstChild);

      // Add CSS animation
      if (!document.querySelector("#toast-animations")) {
        const styleSheet = document.createElement("style");
        styleSheet.id = "toast-animations";
        styleSheet.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
        document.head.appendChild(styleSheet);
      }

      document.body.appendChild(toast);

      // Auto remove after duration
      setTimeout(() => {
        if (toast.parentNode) {
          toast.style.animation = "slideOutRight 0.3s ease-in";
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300);
        }
      }, duration);

      // Click to dismiss
      toast.addEventListener("click", () => {
        if (toast.parentNode) {
          toast.style.animation = "slideOutRight 0.3s ease-in";
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300);
        }
      });

      return toast;
    },
    []
  );

  const showSuccess = useCallback(
    (message, duration) => {
      return showToast(message, "success", duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (message, duration) => {
      return showToast(message, "error", duration);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message, duration) => {
      return showToast(message, "warning", duration);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message, duration) => {
      return showToast(message, "info", duration);
    },
    [showToast]
  );

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useToast;
