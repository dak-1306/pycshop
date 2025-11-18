import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

// Health check
router.get("/health", UserController.healthCheck);

// GET routes only (theo yêu cầu)
router.get("/profile", UserController.getUserProfile);
router.get("/addresses", UserController.getUserAddresses);
// router.get("/addresses/default", UserController.getDefaultAddress);

export default router;
