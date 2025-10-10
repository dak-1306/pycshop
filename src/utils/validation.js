/**
 * Validation utilities for forms
 */
const validateBecomeSellerForm = (formData) => {
  const errors = [];

  // Shop Name validation
  if (!formData.shopName?.trim()) {
    errors.push("Tên shop không được để trống");
  }

  // Shop Description validation
  if (!formData.shopDescription?.trim()) {
    errors.push("Mô tả shop không được để trống");
  }

  // Shop Category validation
  if (!formData.shopCategory) {
    errors.push("Vui lòng chọn danh mục shop");
  }

  // Shop Address validation
  if (!formData.shopAddress?.trim()) {
    errors.push("Địa chỉ shop không được để trống");
  }

  // Shop Phone validation
  if (!formData.shopPhone?.trim()) {
    errors.push("Số điện thoại shop không được để trống");
  } else {
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.shopPhone.trim())) {
      errors.push("Số điện thoại phải có 10-11 chữ số");
    }
  }

  return errors;
};
export { validateBecomeSellerForm };
