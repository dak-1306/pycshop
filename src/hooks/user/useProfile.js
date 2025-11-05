import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import profileService from "../../lib/services/profileService.js";

export const useProfile = () => {
  const { user, updateUser, isAuthenticated, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch user profile from API
  const fetchProfile = useCallback(async () => {
    // Wait for auth to finish loading and check if user is authenticated
    if (authLoading) {
      console.log("Auth still loading, waiting...");
      return;
    }
    
    if (!user || !isAuthenticated) {
      console.log("User not authenticated, skipping profile fetch");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await profileService.getUserProfile();
      if (response.success && response.user) {
        setProfileData(response.user);
        // Update auth context with fresh data
        if (updateUser) {
          updateUser(response.user);
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.message || "Không thể tải thông tin profile");
    } finally {
      setLoading(false);
    }
  }, [user, updateUser, isAuthenticated, authLoading]);

  // Fetch user addresses
  const fetchAddresses = useCallback(async () => {
    // Wait for auth to finish loading and check if user is authenticated
    if (authLoading) {
      console.log("Auth still loading, waiting...");
      return;
    }
    
    if (!user || !isAuthenticated) {
      console.log("User not authenticated, skipping addresses fetch");
      return;
    }

    try {
      const response = await profileService.getAddresses();
      if (response.success && response.addresses) {
        setAddresses(response.addresses);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      // Don't set error for addresses since it's not critical
      // setError(err.message);
    }
  }, [user, isAuthenticated, authLoading]);

  // Update profile
  const updateProfile = useCallback(
    async (profileUpdateData) => {
      if (authLoading || !user || !isAuthenticated) {
        throw new Error("Người dùng chưa đăng nhập");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await profileService.updateProfile(profileUpdateData);
        if (response.success && response.user) {
          setProfileData(response.user);
          // Update auth context
          if (updateUser) {
            updateUser(response.user);
          }
          return response;
        } else {
          throw new Error(response.message || "Cập nhật thông tin thất bại");
        }
      } catch (err) {
        console.error("Failed to update profile:", err);
        setError(err.message || "Cập nhật thông tin thất bại");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateUser, user, isAuthenticated, authLoading]
  );

  // Upload avatar
  const uploadAvatar = useCallback(
    async (avatarFile) => {
      if (authLoading || !user || !isAuthenticated) {
        throw new Error("Người dùng chưa đăng nhập");
      }

      setUploading(true);
      setError(null);

      try {
        const response = await profileService.uploadAvatar(avatarFile);
        if (response.success) {
          // Refresh profile to get updated avatar URL
          await fetchProfile();
          return response;
        } else {
          throw new Error(response.message || "Upload avatar thất bại");
        }
      } catch (err) {
        console.error("Failed to upload avatar:", err);
        setError(err.message || "Upload avatar thất bại");
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [fetchProfile, user, isAuthenticated, authLoading]
  );

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    if (authLoading || !user || !isAuthenticated) {
      throw new Error("Người dùng chưa đăng nhập");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await profileService.changePassword(passwordData);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      console.error("Failed to change password:", err);
      setError(err.message || "Đổi mật khẩu thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, authLoading]);

  // Add address
  const addAddress = useCallback(
    async (addressData) => {
      if (authLoading || !user || !isAuthenticated) {
        throw new Error("Người dùng chưa đăng nhập");
      }

      try {
        const response = await profileService.addAddress(addressData);
        if (response.success) {
          await fetchAddresses(); // Refresh addresses list
          return response;
        } else {
          throw new Error(response.message || "Thêm địa chỉ thất bại");
        }
      } catch (err) {
        console.error("Failed to add address:", err);
        throw err;
      }
    },
    [fetchAddresses, user, isAuthenticated, authLoading]
  );

  // Update address
  const updateAddress = useCallback(
    async (addressId, addressData) => {
      if (authLoading || !user || !isAuthenticated) {
        throw new Error("Người dùng chưa đăng nhập");
      }

      try {
        const response = await profileService.updateAddress(
          addressId,
          addressData
        );
        if (response.success) {
          await fetchAddresses(); // Refresh addresses list
          return response;
        } else {
          throw new Error(response.message || "Cập nhật địa chỉ thất bại");
        }
      } catch (err) {
        console.error("Failed to update address:", err);
        throw err;
      }
    },
    [fetchAddresses, user, isAuthenticated, authLoading]
  );

  // Delete address
  const deleteAddress = useCallback(
    async (addressId) => {
      if (authLoading || !user || !isAuthenticated) {
        throw new Error("Người dùng chưa đăng nhập");
      }

      try {
        const response = await profileService.deleteAddress(addressId);
        if (response.success) {
          await fetchAddresses(); // Refresh addresses list
          return response;
        } else {
          throw new Error(response.message || "Xóa địa chỉ thất bại");
        }
      } catch (err) {
        console.error("Failed to delete address:", err);
        throw err;
      }
    },
    [fetchAddresses, user, isAuthenticated, authLoading]
  );

  // Set default address
  const setDefaultAddress = useCallback(
    async (addressId) => {
      if (authLoading || !user || !isAuthenticated) {
        throw new Error("Người dùng chưa đăng nhập");
      }

      try {
        const response = await profileService.setDefaultAddress(addressId);
        if (response.success) {
          await fetchAddresses(); // Refresh addresses list
          return response;
        } else {
          throw new Error(response.message || "Đặt địa chỉ mặc định thất bại");
        }
      } catch (err) {
        console.error("Failed to set default address:", err);
        throw err;
      }
    },
    [fetchAddresses, user, isAuthenticated, authLoading]
  );

  // Load profile and addresses on mount
  useEffect(() => {
    // Wait for auth to finish loading before attempting to fetch data
    if (!authLoading && user && isAuthenticated) {
      fetchProfile();
      // Fetch addresses separately and don't let it block the profile
      fetchAddresses().catch(err => {
        console.log("Addresses not available:", err.message);
      });
    }
  }, [user, isAuthenticated, authLoading, fetchProfile, fetchAddresses]);

  // Use current user from context as fallback
  const currentProfile = profileData || user;

  return {
    // Data
    profile: currentProfile,
    addresses,

    // Loading states
    loading,
    uploading,
    error,

    // Actions
    fetchProfile,
    updateProfile,
    uploadAvatar,
    changePassword,

    // Address actions
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    fetchAddresses,

    // Utility
    clearError: () => setError(null),
  };
};
