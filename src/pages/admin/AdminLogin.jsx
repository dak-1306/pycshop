import React from "react";
import { Link } from "react-router-dom";
import { useAdminLogin } from "../../hooks/auth/useAdminLogin";
import FormField from "../../components/common/ui/FormField";
import PasswordField from "../../components/common/ui/PasswordField";
import { ADMIN_CONSTANTS } from "../../lib/constants/adminConstants.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminLogin = () => {
  const {
    formData,
    loading,
    error,
    showPassword,
    handleInputChange,
    handleSubmit,
    handleDemoLogin,
    togglePasswordVisibility,
  } = useAdminLogin();

  // Email icon component
  const EmailIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-admin-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-4">
            <FontAwesomeIcon
              icon={["fas", "user-shield"]}
              className="w-10 h-10 text-white"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {ADMIN_CONSTANTS.UI_TEXT.TITLE}
          </h1>
          <p className="text-slate-300">{ADMIN_CONSTANTS.UI_TEXT.SUBTITLE}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon
                  icon={["fas", "exclamation-triangle"]}
                  className="w-5 h-5 text-red-400 flex-shrink-0"
                />
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <FormField
              id="email"
              name="email"
              type="email"
              label={ADMIN_CONSTANTS.UI_TEXT.EMAIL_LABEL}
              value={formData.email}
              onChange={handleInputChange}
              placeholder={ADMIN_CONSTANTS.UI_TEXT.EMAIL_PLACEHOLDER}
              required
              icon={EmailIcon}
            />

            {/* Password Field */}
            <PasswordField
              id="password"
              name="password"
              label={ADMIN_CONSTANTS.UI_TEXT.PASSWORD_LABEL}
              value={formData.password}
              onChange={handleInputChange}
              placeholder={ADMIN_CONSTANTS.UI_TEXT.PASSWORD_PLACEHOLDER}
              required
              showPassword={showPassword}
              onTogglePassword={togglePasswordVisibility}
            />
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon
                    icon={["fas", "spinner"]}
                    className="w-5 h-5"
                  />
                  <span>{ADMIN_CONSTANTS.UI_TEXT.LOADING_BUTTON}</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={["fas", "check"]}
                    className="w-5 h-5"
                  />
                  <span>{ADMIN_CONSTANTS.UI_TEXT.SUBMIT_BUTTON}</span>
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <Link
                to={ADMIN_CONSTANTS.ROUTES.CUSTOMER_LOGIN}
                className="text-slate-300 hover:text-white transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={["fas", "user"]} className="w-4 h-4" />
                <span>{ADMIN_CONSTANTS.UI_TEXT.CUSTOMER_LOGIN_LINK}</span>
              </Link>

              <Link
                to={ADMIN_CONSTANTS.ROUTES.HOME}
                className="text-slate-300 hover:text-white transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={["fas", "home"]} className="w-4 h-4" />
                <span>{ADMIN_CONSTANTS.UI_TEXT.HOME_LINK}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            <FontAwesomeIcon
              icon={["fas", "lock"]}
              className="w-3 h-3 mr-1 inline-block"
            />
            {ADMIN_CONSTANTS.UI_TEXT.SECURITY_NOTICE}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
