import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ userId }).populate({
      path: "products.productId",
      select: "name mainImage basePrice category inStock slug",
    });

    if (!wishlist) {
      // Create empty wishlist if doesn't exist
      wishlist = await Wishlist.create({ userId, products: [] });
    }

    // Filter out any null products (in case product was deleted)
    const validProducts = wishlist.products.filter((item) => item.productId);

    res.json({
      success: true,
      wishlist: {
        _id: wishlist._id,
        products: validProducts,
        count: validProducts.length,
      },
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    // Check if product already in wishlist
    const existingProduct = wishlist.products.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add product to wishlist
    wishlist.products.push({ productId });
    await wishlist.save();

    // Populate the newly added product
    await wishlist.populate({
      path: "products.productId",
      select: "name mainImage basePrice category inStock slug",
    });

    res.json({
      success: true,
      message: "Product added to wishlist",
      wishlist: {
        _id: wishlist._id,
        products: wishlist.products,
        count: wishlist.products.length,
      },
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Créer une wishlist vide au lieu de retourner 404
      wishlist = await Wishlist.create({ userId, products: [] });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();

    // Populate remaining products
    await wishlist.populate({
      path: "products.productId",
      select: "name mainImage basePrice category inStock slug",
    });

    res.json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: {
        _id: wishlist._id,
        products: wishlist.products,
        count: wishlist.products.length,
      },
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Toggle product in wishlist (add if not present, remove if present)
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    // Check if product is in wishlist
    const productIndex = wishlist.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    let message;
    if (productIndex > -1) {
      // Remove product
      wishlist.products.splice(productIndex, 1);
      message = "Product removed from wishlist";
    } else {
      // Add product
      wishlist.products.push({ productId });
      message = "Product added to wishlist";
    }

    await wishlist.save();

    // Populate products
    await wishlist.populate({
      path: "products.productId",
      select: "name mainImage basePrice category inStock slug",
    });

    res.json({
      success: true,
      message,
      inWishlist: productIndex === -1, // true if was added, false if was removed
      wishlist: {
        _id: wishlist._id,
        products: wishlist.products,
        count: wishlist.products.length,
      },
    });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Créer une wishlist vide au lieu de retourner 404
      wishlist = await Wishlist.create({ userId, products: [] });
    }

    wishlist.products = [];
    await wishlist.save();

    res.json({
      success: true,
      message: "Wishlist cleared",
      wishlist: {
        _id: wishlist._id,
        products: [],
        count: 0,
      },
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get wishlist count
export const getWishlistCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ userId });

    const count = wishlist ? wishlist.products.length : 0;

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error getting wishlist count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
