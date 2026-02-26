// ============================================
// contactRoutes.js - Routes
// ============================================
import express from "express";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

// Submit contact form (no auth required)
router.post("/submit", submitContactForm);

export default router;
