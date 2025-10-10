import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { useBecomeSeller } from "../../hooks/useBecomeSeller";
import { useCategories } from "../../hooks/useCategories"; // ← Sử dụng hook hiện có
import BecomeSellerForm from "../../components/seller/BecomeSellerForm";

/**
 * BecomeSeller Page Component
 * Trang đăng ký trở thành seller với form validation và error handling
 */
const BecomeSeller = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getCurrentUser } = useAuth();
  const { becomeSeller, isLoading, error } = useBecomeSeller();
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      const result = await becomeSeller(formData);

      if (result.success) {
        navigate("/seller/dashboard");
      }
      // Error handling is done in the hook
    } catch (error) {
      // Error is handled in the hook and displayed in the form
      console.error("Unexpected error:", error);
    }
  };

  // Show loading while checking authentication
  if (!isAuthenticated()) {
    return <LoadingSpinner message="Đang kiểm tra đăng nhập..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Đăng ký trở thành Seller
          </h1>
          <p className="text-gray-600 mt-2">
            Điền thông tin shop của bạn để bắt đầu bán hàng
          </p>
        </div>

        {/* Hiển thị lỗi categories nếu có */}
        {categoriesError && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              ⚠️ Không thể tải danh mục: {categoriesError}
            </p>
          </div>
        )}

        <BecomeSellerForm
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          submitError={error}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default BecomeSeller;
