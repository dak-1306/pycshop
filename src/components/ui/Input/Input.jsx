import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      disabled = false,
      required = false,
      className = "",
      size = "md",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "block w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-sm",
      lg: "px-4 py-4 text-base",
    };

    const errorClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";

    const classes = [baseClasses, sizes[size], errorClasses, className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={classes}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default Input;
