import React from "react";
import PropTypes from "prop-types";

/**
 * PasswordField Component
 * Specialized password input with show/hide toggle
 * Supports both light and dark theme variants
 */
const PasswordField = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  showPassword,
  onTogglePassword,
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
        "w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white",
      icon: "w-5 h-5 text-gray-400",
      toggleButton:
        "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors",
      error: "mt-1 text-sm text-red-600",
      errorBorder: "border-red-300 focus:ring-red-500",
      requiredStar: "text-red-500",
    },
    dark: {
      label: "block text-sm font-medium text-slate-200 mb-2",
      input:
        "w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
      icon: "w-5 h-5 text-slate-400",
      toggleButton:
        "absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors",
      error: "mt-1 text-sm text-red-400",
      errorBorder: "border-red-500/50 focus:ring-red-500",
      requiredStar: "text-red-400",
    },
  };

  const theme = themes[variant] || themes.dark;

  const LockIcon = () => (
    <svg
      className={theme.icon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={theme.label}>
          {label}
          {required && <span className={`${theme.requiredStar} ml-1`}>*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LockIcon />
        </div>
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${theme.input} ${error ? theme.errorBorder : ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className={theme.toggleButton}
        >
          {showPassword ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
      {error && <p className={theme.error}>{error}</p>}
    </div>
  );
};

PasswordField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showPassword: PropTypes.bool,
  onTogglePassword: PropTypes.func,
  className: PropTypes.string,
  error: PropTypes.string,
  variant: PropTypes.oneOf(["light", "dark"]),
};

export default PasswordField;
