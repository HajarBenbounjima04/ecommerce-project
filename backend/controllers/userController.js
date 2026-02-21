import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user?._id;
    console.log("getUserData - userId from middleware:", userId);

    if (!userId) {
      return res.json({
        success: false,
        message: "Unauthorized - No user ID found",
      });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    console.log("getUserData - User found:", user.name);

    res.json({
      success: true,
      userData: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error("getUserData error:", error);
    res.json({
      success: false,
      message: "Failed to fetch user data",
    });
  }
};
