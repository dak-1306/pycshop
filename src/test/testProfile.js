import { profileService } from "../lib/services/profileService.js";

// Test script để kiểm tra profile API
const testProfileAPI = async () => {
  try {
    console.log("Testing Profile API...");
    
    // Test get user profile
    console.log("1. Testing getUserProfile...");
    const profileResponse = await profileService.getUserProfile();
    console.log("Profile Response:", profileResponse);
    
  } catch (error) {
    console.error("Profile API Test Error:", error);
  }
};

// Export để có thể chạy từ console
window.testProfileAPI = testProfileAPI;

export default testProfileAPI;