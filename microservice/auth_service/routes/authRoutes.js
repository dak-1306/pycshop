import express from "express";
import {
  register,
  login,
  logout,
  registerAdmin,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/admin/login", login); // Route riêng cho admin login
router.post("/logout", logout);

export default router;
