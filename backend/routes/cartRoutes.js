import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getCart,
  getCartCount,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();
router.use((req, res, next) => {
  console.log(`Cart Route: ${req.method} ${req.path}`);
  next();
});

// All routes require authentication
router.use(userAuth);

// Get user's cart
router.get("/", getCart);

// Get cart count only
router.get("/count", getCartCount);

// Add product to cart
router.post("/add", addToCart);

// Update cart item quantity
router.put("/update/:itemId", updateCartItem);

// Remove product from cart - ✅ أضف :itemId هنا
router.delete("/remove/:itemId", removeFromCart);

// Clear entire cart
router.delete("/clear", clearCart);

export default router;
