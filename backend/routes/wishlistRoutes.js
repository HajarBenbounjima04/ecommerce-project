import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  getWishlistCount,
} from "../controllers/wishlistController.js";
import userAuth from "../middleware/userAuth.js"; // Your auth middleware

const router = express.Router();

// All routes require authentication
router.use(userAuth);

// Get user's wishlist
router.get("/", getWishlist);

// Get wishlist count only
router.get("/count", getWishlistCount);

// Add product to wishlist
router.post("/add", addToWishlist);

// Toggle product in wishlist (add/remove)
router.post("/toggle", toggleWishlist);

// Remove product from wishlist
router.delete("/remove/:productId", removeFromWishlist);

// Clear entire wishlist
router.delete("/clear", clearWishlist);

export default router;
