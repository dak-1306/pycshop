import { authService } from "./authService.js";
import { api } from "./apiService.js";

export const profileService = {
  // Get current user profile from API
  getUserProfile: async () => {
    try {
      const response = await authService.fetchCurrentUser();
      return response;
    } catch (error) {
      console.error("Get user profile error:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      
      const response = await api.post("/auth/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response;
    } catch (error) {
      console.error("Upload avatar error:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  // Get user addresses
  getAddresses: async () => {
    try {
      const response = await api.get("/auth/addresses");
      return response;
    } catch (error) {
      console.error("Get addresses error:", error);
      throw error;
    }
  },

  // Add new address
  addAddress: async (addressData) => {
    try {
      const response = await api.post("/auth/addresses", addressData);
      return response;
    } catch (error) {
      console.error("Add address error:", error);
      throw error;
    }
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/auth/addresses/${addressId}`, addressData);
      return response;
    } catch (error) {
      console.error("Update address error:", error);
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/auth/addresses/${addressId}`);
      return response;
    } catch (error) {
      console.error("Delete address error:", error);
      throw error;
    }
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.patch(`/auth/addresses/${addressId}/default`);
      return response;
    } catch (error) {
      console.error("Set default address error:", error);
      throw error;
    }
  },
};

export default profileService;