import express from "express";
import {
  getShopInfo,
  createShop,
  updateShop,
  deleteShop,
  getCategories,
  getShopsByCategory,
  searchShops,
  getShopDetail,
  becomeSeller,
} from "../controller/shopController.js";
import {
  verifyToken,
  requireSeller,
  requireBuyer,
} from "../middleware/auth.js";

const router = express.Router();

// Middleware to extract user info from headers (from API Gateway)
const extractUserInfo = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  const userRole = req.headers["x-user-role"];

  if (userId && userRole) {
    req.user = {
      id: userId,
      role: userRole,
    };
    console.log(
      `[SHOP_ROUTES] User extracted from headers: ${userId}, role: ${userRole}`
    );
  } else {
    console.log(`[SHOP_ROUTES] No user info in headers`);
  }

  next();
};

// Public routes (no authentication required)
router.get("/categories", getCategories);
router.get("/search", searchShops);
router.get("/category/:categoryId", getShopsByCategory);

// Routes that need authentication
router.use(extractUserInfo);

// Specific authenticated routes (must come before dynamic routes)
router.get("/info", requireSeller, getShopInfo);
router.post("/create", requireSeller, createShop);
router.put("/update", requireSeller, updateShop);
router.delete("/delete", requireSeller, deleteShop);

// Become seller route (buyer to seller)
router.post("/become-seller", becomeSeller);

// Dynamic routes (must come after specific routes)
router.get("/shop/:shopId", getShopDetail);

export default router;
