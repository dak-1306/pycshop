import express from "express";
import {
  register,
  login,
  logout,
  registerAdmin,
  getCurrentUser,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/admin/login", login); // Route riêng cho admin login
router.post("/logout", logout);

// Get current user profile (protected route)
router.get("/me", getCurrentUser);

// Update user profile (protected route)
router.put("/profile", updateProfile);

// Address management (protected routes)
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:id", updateAddress);
router.delete("/addresses/:id", deleteAddress);
router.patch("/addresses/:id/default", setDefaultAddress);

export default router;
