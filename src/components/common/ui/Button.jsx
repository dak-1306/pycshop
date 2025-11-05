import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  role = "common", // 'admin', 'seller', 'common'
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  // Base styles with modern design
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95";

  // Size variants
  const sizeStyles = {
    xs: "px-2 py-1 text-xs gap-1",
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    xl: "px-8 py-4 text-lg gap-3",
  };

  // Color variants based on role and variant using new design system
  const getVariantStyles = () => {
    const variants = {
      admin: {
        primary:
          "bg-gradient-to-r from-admin-500 to-admin-600 hover:from-admin-600 hover:to-admin-700 text-white shadow-lg hover:shadow-xl focus:ring-admin-500",
        secondary:
          "bg-white border-2 border-admin-500 text-admin-600 hover:bg-admin-50 focus:ring-admin-500",
        danger:
          "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
        success:
          "bg-gradient-to-r from-status-success to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500",
        warning:
          "bg-gradient-to-r from-status-warning to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500",
        ghost:
          "bg-transparent text-admin-600 hover:bg-admin-50 focus:ring-admin-500",
      },
      seller: {
        primary:
          "bg-gradient-to-r from-seller-500 to-seller-600 hover:from-seller-600 hover:to-seller-700 text-white shadow-lg hover:shadow-xl focus:ring-seller-500",
        secondary:
          "bg-white border-2 border-seller-500 text-seller-600 hover:bg-seller-50 focus:ring-seller-500",
        danger:
          "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
        success:
          "bg-gradient-to-r from-status-success to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500",
        warning:
          "bg-gradient-to-r from-status-warning to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500",
        ghost:
          "bg-transparent text-seller-600 hover:bg-seller-50 focus:ring-seller-500",
      },
      common: {
        primary:
          "bg-gradient-to-r from-buyer-500 to-buyer-600 hover:from-buyer-600 hover:to-buyer-700 text-white shadow-lg hover:shadow-xl focus:ring-buyer-500",
        secondary:
          "bg-white border-2 border-buyer-500 text-buyer-600 hover:bg-buyer-50 focus:ring-buyer-500",
        danger:
          "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
        success:
          "bg-gradient-to-r from-status-success to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500",
        warning:
          "bg-gradient-to-r from-status-warning to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500",
        ghost:
          "bg-transparent text-buyer-600 hover:bg-buyer-50 focus:ring-buyer-500",
      },
    };
    return variants[role]?.[variant] || variants.common[variant];
  };

  // Disabled styles
  const disabledStyles =
    "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none";

  // Loading styles
  const loadingStyles = "cursor-wait";

  // Combine all styles
  const buttonStyles = [
    baseStyles,
    sizeStyles[size],
    getVariantStyles(),
    disabled && disabledStyles,
    loading && loadingStyles,
    (disabled || loading) && "hover:scale-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <FontAwesomeIcon icon={["fas", "spinner"]} className="animate-spin" />
      )}

      {!loading && icon && iconPosition === "left" && (
        <FontAwesomeIcon icon={icon} />
      )}

      {children}

      {!loading && icon && iconPosition === "right" && (
        <FontAwesomeIcon icon={icon} />
      )}
    </button>
  );
};

Button.displayName = "Button";

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "success",
    "warning",
    "ghost",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  role: PropTypes.oneOf(["admin", "seller", "common"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.array,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
};

export default Button;
