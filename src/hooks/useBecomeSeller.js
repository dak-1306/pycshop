import { useState } from "react";
import { useAuth } from "./auth/useAuth";
import ShopService from "../services/shopService";
import { validateBecomeSellerForm } from "../utils/validation";

/**
 * Custom hook for become seller functionality
 */
export const useBecomeSeller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateUser } = useAuth();

  const becomeSeller = async (formData) => {
    // Validate form
    const validationErrors = validateBecomeSellerForm(formData);
    if (validationErrors.length > 0) {
      const error = new Error("Validation failed");
      error.validationErrors = validationErrors;
      setError(error);
      throw error;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ShopService.becomeSeller(formData);

      if (result.success) {
        // Update user context if new data provided
        if (result.user) {
          updateUser(result.user);
        }

        return { success: true, message: "Đăng ký thành seller thành công!" };
      } else {
        throw new Error(
          result.message || "Có lỗi xảy ra trong quá trình đăng ký"
        );
      }
    } catch (error) {
      const errorMessage =
        error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    becomeSeller,
    isLoading,
    error,
  };
};
