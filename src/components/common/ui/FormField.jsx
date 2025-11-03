import React from "react";
import PropTypes from "prop-types";

/**
 * FormField Component
 * Reusable input field with icon and styling
 * Supports both light and dark theme variants
 */
const FormField = ({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
  className = "",
  error,
  variant = "dark", // "light" | "dark"
  ...props
}) => {
  // Theme configurations
  const themes = {
    light: {
      label: "block text-sm font-medium text-gray-700 mb-2",
      input:
        "w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white",
      icon: "w-5 h-5 text-gray-400",
      error: "mt-1 text-sm text-red-600",
      errorBorder: "border-red-300 focus:ring-red-500",
      requiredStar: "text-red-500",
    },
    dark: {
      label: "block text-sm font-medium text-slate-200 mb-2",
      input:
        "w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      icon: "w-5 h-5 text-slate-400",
      error: "mt-1 text-sm text-red-400",
      errorBorder: "border-red-500/50 focus:ring-red-500",
      requiredStar: "text-red-400",
    },
  };

  const theme = themes[variant] || themes.dark;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={theme.label}>
          {label}
          {required && <span className={`${theme.requiredStar} ml-1`}>*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={theme.icon} />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${theme.input} ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-3 transition-all ${error ? theme.errorBorder : ""}`}
          {...props}
        />
      </div>
      {error && <p className={theme.error}>{error}</p>}
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  error: PropTypes.string,
  variant: PropTypes.oneOf(["light", "dark"]),
};

export default FormField;
