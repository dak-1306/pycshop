import express from "express";
import {
  register,
  login,
  logout,
  registerAdmin,
  becomeSeller,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/logout", logout);
router.post("/become-seller", becomeSeller);

export default router;
