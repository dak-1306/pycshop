import express from "express";
import {
  getShopInfo,
  createShop,
  updateShop,
  deleteShop,
  getCategories,
  getShopsByCategory,
  searchShops,
  getShopById,
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
router.get("/:shopId", getShopById);

// Routes that need authentication
router.use(extractUserInfo);

// Become seller route (buyer to seller)
router.post("/become-seller", becomeSeller);

// Seller-specific routes (require seller role)
router.get("/info", getShopInfo);
router.post("/create", createShop);
router.put("/update", updateShop);
router.delete("/delete", deleteShop);

export default router;
