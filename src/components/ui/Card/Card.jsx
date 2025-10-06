import React from "react";
import PropTypes from "prop-types";

const Card = ({
  children,
  title,
  subtitle,
  actions,
  padding = "md",
  shadow = "md",
  rounded = "lg",
  className = "",
  ...props
}) => {
  const baseClasses = "bg-white border border-gray-200";

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const roundeds = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  const classes = [
    baseClasses,
    paddings[padding],
    shadows[shadow],
    roundeds[rounded],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">{actions}</div>
          )}
        </div>
      )}

      <div className={title || subtitle || actions ? "mt-0" : ""}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  padding: PropTypes.oneOf(["none", "sm", "md", "lg"]),
  shadow: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
};

export default Card;
