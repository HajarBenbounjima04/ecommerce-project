import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createOrder,
  getUserOrders,
  getOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// All routes require authentication
router.use(userAuth);

// Create new order
router.post("/create", createOrder);

// Get user's orders
router.get("/", getUserOrders);

// Get single order
router.get("/:orderId", getOrder);

export default router;
