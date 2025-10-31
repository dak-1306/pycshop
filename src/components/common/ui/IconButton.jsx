import React from "react";
import Button from "./Button";
import PropTypes from "prop-types";

/**
 * IconButton - Button with just an icon, perfect for toolbar actions
 */
const IconButton = ({
  icon,
  children,
  size = "md",
  variant = "ghost",
  role = "common",
  tooltip,
  ...props
}) => {
  return (
    <Button
      icon={icon}
      size={size}
      variant={variant}
      role={role}
      className={`aspect-square justify-center ${!children ? "px-0" : ""}`}
      title={tooltip}
      {...props}
    >
      {children}
    </Button>
  );
};

IconButton.displayName = "IconButton";

IconButton.propTypes = {
  icon: PropTypes.array.isRequired,
  children: PropTypes.node,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "success",
    "warning",
    "ghost",
  ]),
  role: PropTypes.oneOf(["admin", "seller", "common"]),
  tooltip: PropTypes.string,
};

export default IconButton;
