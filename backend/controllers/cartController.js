// ============================================
// FIXED cartController.js - Using item matching
// ============================================
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

// Get cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await cartModel.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = await cartModel.create({
        userId,
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0,
      });
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Helper function to match cart items
// Helper function améliorée
const matchesCartItem = (item, productId, selectedSize, selectedMaterial, selectedCharacteristics) => {
  // Vérifier product ID
  if (item.productId.toString() !== productId.toString()) {
    return false;
  }

  // Si selectedCharacteristics existe, comparer uniquement cela
  const itemChar = item.selectedCharacteristics;
  const requestChar = selectedCharacteristics;
  
  if (itemChar || requestChar) {
    // Si l'un a selectedCharacteristics et pas l'autre
    if (!itemChar || !requestChar) return false;
    // Les deux ont selectedCharacteristics
    return itemChar.value === requestChar.value;
  }

  // Pas de selectedCharacteristics, vérifier size et material
  const itemSize = item.selectedSize;
  const requestSize = selectedSize;
  const itemMaterial = item.selectedMaterial;
  const requestMaterial = selectedMaterial;

  // Les deux doivent être null OU les deux doivent match
  const sizesMatch =
    (!itemSize && !requestSize) ||
    (itemSize && requestSize &&
      itemSize.value === requestSize.value &&
      itemSize.unit === requestSize.unit);

  const materialsMatch =
    (!itemMaterial && !requestMaterial) ||
    (itemMaterial && requestMaterial &&
      itemMaterial.name === requestMaterial.name);

  return sizesMatch && materialsMatch;
};
// Dans addToCart
export const addToCart = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      selectedSize,
      selectedMaterial,
      characteristics, // ✅ Les caractéristiques sélectionnées
    } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // Calculate price based on selections
    let priceAtAdd = product.basePrice;
    let selectedCharacteristicsInfo = null;

    if (product.characteristics && characteristics) {
      product.characteristics.forEach((char) => {
        const selection = characteristics[char.name];
        if (!selection) return;

        if (char.type === "size" && char.sizeOptions) {
          const selected = char.sizeOptions.find(
            (s) => `${s.value}${s.unit}` === selection
          );
          if (selected) priceAtAdd = selected.price;
        }

        if (char.type === "material" && char.materialOptions) {
          const selected = char.materialOptions.find(
            (m) => m.name === selection
          );
          if (selected) {
            priceAtAdd = selected.isPercentage
              ? priceAtAdd * (1 + selected.priceModifier / 100)
              : priceAtAdd + selected.priceModifier;
          }
        }

        // ✅ Pour les caractéristiques "other"
        if (char.type === "other" && char.options) {
          const selected = char.options.find((o) => o.value === selection);
          if (selected) {
            priceAtAdd = selected.price;
            // Sauvegarder la sélection
            selectedCharacteristicsInfo = {
              name: char.name,
              label: selected.label,
              value: selected.value,
            };
          }
        }
      });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0,
      });
    }

    // ✅ Inclure selectedCharacteristics dans la correspondance
    const existingItemIndex = cart.items.findIndex((item) => {
      if (item.productId.toString() !== productId.toString()) {
        return false;
      }

      // Vérifier selectedCharacteristics
      if (selectedCharacteristicsInfo && item.selectedCharacteristics) {
        return (
          item.selectedCharacteristics.value ===
          selectedCharacteristicsInfo.value
        );
      }

      return matchesCartItem(item, productId, selectedSize, selectedMaterial);
    });

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        selectedSize: selectedSize || null,
        selectedMaterial: selectedMaterial || null,
        selectedCharacteristics: selectedCharacteristicsInfo, // ✅ Sauvegarder la sélection
        priceAtAdd,
      });
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0
    );
    cart.total = cart.subtotal;
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    await cart.save();
    await cart.populate("items.productId");

    res.json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params; // ✅ De l'URL
    const { quantity } = req.body; // ✅ Du body
    const userId = req.user._id;

    console.log("=== UPDATE CART ITEM ===");
    console.log("itemId from params:", itemId);
    console.log("quantity from body:", quantity);

    if (!itemId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Item ID and valid quantity are required",
      });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id && item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items[itemIndex].quantity = quantity;

    // Recalculate totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0
    );
    cart.total = cart.subtotal;
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    await cart.save();
    await cart.populate("items.productId");

    console.log("✅ Cart updated successfully");

    res.json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    console.log("=== BACKEND REMOVE REQUEST ===");
    console.log("itemId from params:", itemId);
    console.log("userId:", userId);

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    const cart = await cartModel.findOne({ userId });

    console.log("Cart found:", !!cart);
    console.log("Cart items count:", cart?.items?.length || 0);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // ✅ أضف هذا لرؤية كل الـ items
    console.log("=== ALL CART ITEMS ===");
    cart.items.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        _id: item._id?.toString(),
        productId: item.productId?.toString(),
        hasId: !!item._id,
      });
    });

    const itemIndex = cart.items.findIndex(
      (item) => item._id && item._id.toString() === itemId
    );

    console.log("Item index found:", itemIndex);

    if (itemIndex === -1) {
      console.log("❌ Item not found in cart");
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1);

    // Recalculate totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0
    );
    cart.total = cart.subtotal;
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    await cart.save();
    await cart.populate("items.productId");

    console.log("✅ Item removed successfully");

    res.json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.total = 0;
    cart.itemCount = 0;

    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get cart count
export const getCartCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOne({ userId });

    res.json({
      success: true,
      count: cart?.itemCount || 0,
    });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
