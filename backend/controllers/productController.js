import productModel from "../models/productModel.js";

const uploadImageToCloud = async (imageBuffer, filename) => {
  return `https://your-storage.com/images/${filename}`;
};

//  Create Product - Updated with Quantity Tiers Support
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      stockQuantity = 0,
      inStock = true,
      tags,
      // JSON strings from React form
      characteristics,
      quantityTiers,
    } = req.body;

    console.log("Received data:", req.body);
    console.log("Files:", req.files);

    if (!name || !description || !category || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category, and base price are required",
      });
    }

    // Main image
let mainImageUrl = req.body.mainImage || ""; 
   if (req.files?.mainImage?.[0]) {
      mainImageUrl = await uploadImageToCloud(
        req.files.mainImage[0].buffer,
        `main_${Date.now()}_${req.files.mainImage[0].originalname}`
      );
    }

    // Additional images
    let additionalImages = [];
    if (req.files?.images) {
      for (let i = 0; i < req.files.images.length; i++) {
        const imageUrl = await uploadImageToCloud(
          req.files.images[i].buffer,
          `img_${Date.now()}_${i}_${req.files.images[i].originalname}`
        );
        additionalImages.push(imageUrl);
      }
    }

    // Tags
    let processedTags = [];
    if (tags) {
      processedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    // Parse characteristics from JSON
    let parsedCharacteristics = [];
    if (characteristics) {
      try {
        const characteristicsData = JSON.parse(characteristics);
        console.log("Parsed characteristics:", characteristicsData);

        parsedCharacteristics = characteristicsData.map((char) => {
          const processedChar = {
            name: char.name,
            type: char.type,
          };

          // Handle size options with quantity tiers
          if (char.type === "size" && char.sizeOptions) {
            processedChar.sizeOptions = char.sizeOptions.map((size) => ({
              value: parseFloat(size.value),
              unit: size.unit,
              price: parseFloat(size.price),
              quantityTiers: (size.quantityTiers || [])
                .map((tier) => ({
                  minQuantity: parseInt(tier.minQuantity),
                  maxQuantity: parseInt(tier.maxQuantity),
                  price: parseFloat(tier.price),
                }))
                .filter(
                  (tier) =>
                    !isNaN(tier.minQuantity) &&
                    !isNaN(tier.maxQuantity) &&
                    !isNaN(tier.price)
                ),
            }));
          }

          // Handle material options
          if (char.type === "material" && char.materialOptions) {
            processedChar.materialOptions = char.materialOptions.map(
              (material) => ({
                name: material.name,
                priceModifier: parseFloat(material.priceModifier) || 0,
                isPercentage: Boolean(material.isPercentage),
              })
            );
          }

          // Handle other options (weight, custom) with quantity tiers
          if (["weight", "other"].includes(char.type) && char.options) {
            processedChar.options = char.options.map((option) => ({
              label: option.label,
              value: option.value,
              price: parseFloat(option.price),
              quantityTiers: (option.quantityTiers || [])
                .map((tier) => ({
                  minQuantity: parseInt(tier.minQuantity),
                  maxQuantity: parseInt(tier.maxQuantity),
                  price: parseFloat(tier.price),
                }))
                .filter(
                  (tier) =>
                    !isNaN(tier.minQuantity) &&
                    !isNaN(tier.maxQuantity) &&
                    !isNaN(tier.price)
                ),
            }));
          }

          return processedChar;
        });
      } catch (error) {
        console.error("Error parsing characteristics:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid characteristics data format",
        });
      }
    }

    // Parse global quantity tiers from JSON
    let parsedQuantityTiers = [];
    if (quantityTiers) {
      try {
        const quantityTiersData = JSON.parse(quantityTiers);
        console.log("Parsed quantity tiers:", quantityTiersData);

        parsedQuantityTiers = quantityTiersData
          .map((tier) => ({
            minQuantity: parseInt(tier.minQuantity),
            maxQuantity: parseInt(tier.maxQuantity),
            price: parseFloat(tier.price),
          }))
          .filter(
            (tier) =>
              !isNaN(tier.minQuantity) &&
              !isNaN(tier.maxQuantity) &&
              !isNaN(tier.price)
          );
      } catch (error) {
        console.error("Error parsing quantity tiers:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid quantity tiers data format",
        });
      }
    }

    // Build product object
    const productData = {
      name: name.trim(),
      description: description.trim(),
      category,
      basePrice: parseFloat(basePrice),
      mainImage: mainImageUrl,
      images: additionalImages,
      inStock: inStock === "on" || inStock === true || inStock === "true",
      stockQuantity: parseInt(stockQuantity) || 0,
      tags: processedTags,
      characteristics: parsedCharacteristics,
      quantityTiers: parsedQuantityTiers,
      isActive: true,
    };

    console.log("Final product data:", JSON.stringify(productData, null, 2));

    const newProduct = new productModel(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A product with this name already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// ✅ Get all products (unchanged)
export const getAllProducts = async (req, res) => {
  try {
    const { category, isActive, search, limit = 20, page = 1 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await productModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await productModel.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get single product (unchanged)
export const getProduct = async (req, res) => {
  try {
    const { identifier } = req.params;

    let product = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await productModel.findById(identifier);
    } else {
      product = await productModel.findOne({ slug: identifier });
    }

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Update product - Enhanced with characteristics support
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body, updatedAt: new Date() };

    // Parse JSON fields if they exist
    if (
      updateData.characteristics &&
      typeof updateData.characteristics === "string"
    ) {
      try {
        updateData.characteristics = JSON.parse(updateData.characteristics);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid characteristics data format",
        });
      }
    }

    if (
      updateData.quantityTiers &&
      typeof updateData.quantityTiers === "string"
    ) {
      try {
        updateData.quantityTiers = JSON.parse(updateData.quantityTiers);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity tiers data format",
        });
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Delete product (unchanged)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Version corrigée de calculateProductPrice
// À remplacer dans controllers/productController.js

export const calculateProductPrice = (product, selections = {}) => {
  let finalPrice = product.basePrice;
  let applicableQuantityTiers = product.quantityTiers || [];
  let materialModifier = null; // Stocker le modificateur de matériau

  // Apply characteristic-based pricing
  if (product.characteristics && selections.characteristics) {
    product.characteristics.forEach((char) => {
      const selection = selections.characteristics[char.name];
      if (!selection) return;

      if (char.type === "size" && char.sizeOptions) {
        const selectedSize = char.sizeOptions.find(
          (size) => `${size.value}${size.unit}` === selection
        );
        if (selectedSize) {
          finalPrice = selectedSize.price;
          // Use size-specific quantity tiers if available
          if (
            selectedSize.quantityTiers &&
            selectedSize.quantityTiers.length > 0
          ) {
            applicableQuantityTiers = selectedSize.quantityTiers;
          }
        }
      }

      if (char.type === "material" && char.materialOptions) {
        const selectedMaterial = char.materialOptions.find(
          (material) => material.name === selection
        );
        if (selectedMaterial) {
          // Stocker le modificateur pour l'appliquer APRÈS les quantity tiers
          materialModifier = {
            value: selectedMaterial.priceModifier,
            isPercentage: selectedMaterial.isPercentage
          };
        }
      }

      if (["weight", "other"].includes(char.type) && char.options) {
        const selectedOption = char.options.find(
          (option) => option.value === selection
        );
        if (selectedOption) {
          finalPrice = selectedOption.price;
          // Use option-specific quantity tiers if available
          if (
            selectedOption.quantityTiers &&
            selectedOption.quantityTiers.length > 0
          ) {
            applicableQuantityTiers = selectedOption.quantityTiers;
          }
        }
      }
    });
  }

  // Apply quantity-based pricing BEFORE material modifiers
  if (selections.quantity && applicableQuantityTiers.length > 0) {
    const quantity = parseInt(selections.quantity);
    const applicableTier = applicableQuantityTiers.find(
      (tier) => quantity >= tier.minQuantity && quantity <= tier.maxQuantity
    );
    if (applicableTier) {
      finalPrice = applicableTier.price;
    }
  }

  // Apply material modifier AFTER quantity tiers
  if (materialModifier) {
    if (materialModifier.isPercentage) {
      finalPrice *= 1 + materialModifier.value / 100;
    } else {
      finalPrice += materialModifier.value;
    }
  }

  return Math.round(finalPrice * 100) / 100; // Round to 2 decimal places
};