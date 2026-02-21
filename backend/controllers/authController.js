import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {
  WELCOME_EMAIL_TEMPLATE,
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplate.js";

const replaceTemplateVariables = (template, variables) => {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, value || "");
  }
  return result;
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Data" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  if (password.length < 6) {
    return res.json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
const user = new userModel({ name, email, password: hashedPassword });
await user.save();

const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const templateVariables = {
      name: name,
      email: email,
      loginUrl: process.env.CLIENT_URL || "http://localhost:5173/login",
      facebookUrl:
        "https://facebook.com/taskbohttp://localhost:5173/verify-emailard",
      twitterUrl: "https://twitter.com/taskboard",
      instagramUrl: "https://instagram.com/taskboard",
      phone: process.env.SUPPORT_PHONE || "+212 674312200",
      supportEmail: process.env.SUPPORT_EMAIL || "hajarbenbounjima@gmail.com",
    };

    const htmlContent = replaceTemplateVariables(
      WELCOME_EMAIL_TEMPLATE,
      templateVariables
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to TaskBoard",
      text: `Welcome to TaskBoard website! Your account has been created with email id: ${email}`,
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome to TaskBoard</title></head><body style="margin:0;padding:0;background-color:#f7eded;font-family:Arial,sans-serif"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f7eded">${htmlContent}</table></body></html>`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return res.json({ success: true, token: token });
  } catch (error) {
    console.error("Registration error:", error);
    res.json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message:
          "No account found with this email address. Please check your email or sign up.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, token: token });
  } catch (error) {
    console.error("Login error:", error);
    res.json({ success: false, message: "Login failed. Please try again." });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    console.log("sendVerifyOtp - req.body:", req.body);
    const { userId } = req.body;
    console.log("sendVerifyOtp - userId:", userId);

    const user = await userModel.findById(userId);
    console.log("sendVerifyOtp - user found:", user ? "Yes" : "No");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      console.log("sendVerifyOtp - Account already verified");
      return res.json({ success: false, message: "Account Already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    console.log("sendVerifyOtp - Generated OTP:", otp);

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const templateVariables = {
      name: user.name,
      otp: otp,
      phone: process.env.SUPPORT_PHONE || "+1-234-567-8900",
      supportEmail: process.env.SUPPORT_EMAIL || "support@taskboard.com",
    };

    const htmlContent = replaceTemplateVariables(
      EMAIL_VERIFY_TEMPLATE,
      templateVariables
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP - TaskBoard",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Verify Your Email - TaskBoard</title></head><body style="margin:0;padding:0;background-color:#f7eded;font-family:Arial,sans-serif"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f7eded">${htmlContent}</table></body></html>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("sendVerifyOtp - Email sent successfully");

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("sendVerifyOtp - Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).select("-password");
    return res.json({
      success: true,
      message: "Authentication working",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Version améliorée de sendResetOtp avec meilleure gestion d'erreurs

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "No account found with this email address",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    console.log("sendResetOtp - Generated OTP:", otp);

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const templateVariables = {
      name: user.name,
      otp: otp,
      resetUrl: `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/reset-password?email=${encodeURIComponent(email)}`,
      phone: process.env.SUPPORT_PHONE || "+1-234-567-8900",
      supportEmail: process.env.SUPPORT_EMAIL || "support@taskboard.com",
    };

    const htmlContent = replaceTemplateVariables(
      PASSWORD_RESET_TEMPLATE,
      templateVariables
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP - TaskBoard",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Reset Your Password - TaskBoard</title></head><body style="margin:0;padding:0;background-color:#f7eded;font-family:Arial,sans-serif"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f7eded">${htmlContent}</table></body></html>`,
    };

    // ✅ Meilleure gestion d'erreurs avec timeout
    try {
      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: "OTP sent to your email" });
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
      
      // ✅ Vérifier si c'est une erreur d'authentification SMTP
      if (emailError.code === 'EAUTH') {
        console.error("⚠️ SMTP Authentication Error. Check your credentials:");
        console.error(`SMTP_USER: ${process.env.SMTP_USER ? 'Set ✓' : 'Missing ✗'}`);
        console.error(`SMTP_PASS: ${process.env.SMTP_PASS ? 'Set ✓' : 'Missing ✗'}`);
        console.error(`SENDER_EMAIL: ${process.env.SENDER_EMAIL ? 'Set ✓' : 'Missing ✗'}`);
      }
      
      return res.json({
        success: false,
        message: "Failed to send email. Please try again later or contact support.",
      });
    }
  } catch (error) {
    console.error("sendResetOtp error:", error);
    res.json({
      success: false,
      message: "Failed to send reset OTP. Please try again.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "No account found with this email address",
      });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.json({
      success: false,
      message: "Failed to reset password. Please try again.",
    });
  }
};
