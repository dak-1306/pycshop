import { useState, useCallback } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login function
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Import authService dynamically to avoid circular dependencies
      const { default: authService } = await import(
        "../../services/authService.js"
      );

      const response = await authService.login(credentials);

      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", response.token);
        return response;
      } else {
        throw new Error(response.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { default: authService } = await import(
        "../../services/authService.js"
      );

      const response = await authService.register(userData);

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Đăng ký thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const { default: authService } = await import(
        "../../services/authService.js"
      );
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { default: authService } = await import(
        "../../services/authService.js"
      );

      const response = await authService.getCurrentUser();

      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Refresh user error:", err);
      setUser(null);
      setIsAuthenticated(false);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { default: authService } = await import(
        "../../services/authService.js"
      );

      const response = await authService.updateProfile(profileData);

      if (response.success) {
        setUser(response.user);
        return response;
      } else {
        throw new Error(response.message || "Cập nhật thông tin thất bại");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message || "Cập nhật thông tin thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { default: authService } = await import(
        "../../services/authService.js"
      );

      const response = await authService.changePassword(passwordData);

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.message || "Đổi mật khẩu thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user has specific role
  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.role === "admin";
  }, [user]);

  // Check if user is seller
  const isSeller = useCallback(() => {
    return user?.role === "seller";
  }, [user]);

  // Check if user is buyer
  const isBuyer = useCallback(() => {
    return user?.role === "buyer";
  }, [user]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    changePassword,

    // Helpers
    hasRole,
    isAdmin,
    isSeller,
    isBuyer,
  };
};
