import { useState } from "react";

// Custom hook for form validation
export const useFormValidation = () => {
  const [errors, setErrors] = useState([]);

  const validateShopForm = (formData) => {
    const validationErrors = [];

    if (!formData.shopName?.trim()) {
      validationErrors.push("Tên shop không được để trống");
    }

    if (!formData.shopDescription?.trim()) {
      validationErrors.push("Mô tả shop không được để trống");
    }

    if (!formData.shopCategory) {
      validationErrors.push("Vui lòng chọn danh mục shop");
    }

    if (!formData.shopAddress?.trim()) {
      validationErrors.push("Địa chỉ shop không được để trống");
    }

    if (!formData.shopPhone?.trim()) {
      validationErrors.push("Số điện thoại shop không được để trống");
    } else {
      // Validate phone number format
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.shopPhone.trim())) {
        validationErrors.push("Số điện thoại phải có 10-11 chữ số");
      }
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  return {
    errors,
    validateShopForm,
    clearErrors: () => setErrors([]),
  };
};
