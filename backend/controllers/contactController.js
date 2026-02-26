// ============================================
// contactController.js - Backend Controller
// ============================================
import contactModel from "../models/contactModel.js";

// Submit contact form
export const submitContactForm = async (req, res) => {
  try {
    let { name, email, phone, subject, message } = req.body;
    
    // ✅ Trim AVANT validation
    name = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();
    subject = subject?.trim();
    message = message?.trim();

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, email, subject, message)",
      });
    }

    // Email validation (maintenant sur l'email trimmed)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "127.0.0.1";
const userAgent = req.headers["user-agent"] || "test-agent"; // ✅ Valeur par défaut

// Create contact entry
const contact = new contactModel({
  name,
  email,
  phone: phone || "",
  subject,
  message,
  ipAddress,
  userAgent,
});

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We will get back to you soon.",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form. Please try again later.",
    });
  }
};