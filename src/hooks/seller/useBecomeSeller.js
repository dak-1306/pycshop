import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import ShopService from "../../services/ShopService";

const useBecomeSeller = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, login } = useAuth();

  const becomeSeller = useCallback(
    async (shopData) => {
      setLoading(true);
      setError(null);

      try {
        // Attach current user id to payload if available
        const payload = { ...shopData };
        if (user && user.id) {
          payload.userId = user.id;
        } else if (user && user.ID) {
          // In case user object uses different key
          payload.userId = user.ID;
        }

        console.log("useBecomeSeller: payload sent:", payload);

        const result = await ShopService.becomeSeller(payload);

        // If backend returns new token and user, update auth context
        if (result?.success && result.token && result.user) {
          try {
            login(result.user, result.token);
          } catch (err) {
            console.error("useBecomeSeller - login update failed:", err);
          }
        }

        // Normalize response shape
        if (result?.success) {
          return {
            success: true,
            message: result.message || "Đăng ký thành seller thành công!",
            data: result,
          };
        }

        const errorMessage =
          result?.message || "Có lỗi xảy ra trong quá trình đăng ký";
        setError(errorMessage);
        return { success: false, message: errorMessage, data: result };
      } catch (err) {
        console.error("useBecomeSeller - caught error:", err);
        let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau.";
        if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [login, user]
  );

  return { becomeSeller, loading, error };
};

export default useBecomeSeller;
