import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { ADMIN_CONSTANTS } from "../../constants/adminConstants";

export const useAdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in as admin
  useEffect(() => {
    if (authService.isAuthenticated() && authService.isAdmin()) {
      // Already logged in as admin, redirect to dashboard
      navigate(ADMIN_CONSTANTS.ROUTES.ADMIN_DASHBOARD, { replace: true });
    }

    // Check if redirected due to insufficient permissions
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get("reason") === ADMIN_CONSTANTS.QUERY_PARAMS.NO_PERMISSION
    ) {
      setError(ADMIN_CONSTANTS.ERROR_MESSAGES.NO_PERMISSION);
    }
  }, [navigate]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when user starts typing
      if (error) setError("");
    },
    [error]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        // Call admin-specific API endpoint
        const response = await authService.adminLogin(
          formData.email,
          formData.password
        );

        console.log("Admin login response:", response);

        // Success - user is verified admin
        localStorage.setItem("loginTime", new Date().toISOString());

        // Redirect to admin dashboard
        navigate(ADMIN_CONSTANTS.ROUTES.ADMIN_DASHBOARD, { replace: true });
      } catch (err) {
        console.error("Admin login error:", err);
        setError(err.message || ADMIN_CONSTANTS.ERROR_MESSAGES.LOGIN_FAILED);
      } finally {
        setLoading(false);
      }
    },
    [formData.email, formData.password, navigate]
  );

  const handleDemoLogin = useCallback(() => {
    setFormData({
      email: ADMIN_CONSTANTS.DEMO_CREDENTIALS.email,
      password: ADMIN_CONSTANTS.DEMO_CREDENTIALS.password,
    });
    setError("");
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    formData,
    loading,
    error,
    showPassword,
    handleInputChange,
    handleSubmit,
    handleDemoLogin,
    togglePasswordVisibility,
  };
};
