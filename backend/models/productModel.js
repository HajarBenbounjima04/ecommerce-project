import mongoose from "mongoose";

const quantityTierSchema = new mongoose.Schema(
  {
    minQuantity: {
      type: Number,
      required: true,
    },
    maxQuantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// Schema for size options (can be in grams or liters)
const sizeOptionSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["g", "L", "ml", "kg"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantityTiers: [quantityTierSchema], // Optional quantity-based pricing for this size
  },
  { _id: false }
);

// Schema for material options
const materialOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "Glass", "Plastic", "Handmade"
    },
    priceModifier: {
      type: Number,
      default: 0, // Additional cost or discount for this material
    },
    isPercentage: {
      type: Boolean,
      default: false, // true if priceModifier is a percentage, false if fixed amount
    },
  },
  { _id: false }
);

// Schema for product characteristics/criteria
const characteristicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "Size", "Material", "Weight"
    },
    type: {
      type: String,
      enum: ["size", "material", "weight", "other"],
      required: true,
    },
    // For size characteristics
    sizeOptions: [sizeOptionSchema],
    // For material characteristics
    materialOptions: [materialOptionSchema],
    // For weight or other simple characteristics
    options: [
      {
        label: String,
        value: String,
        price: Number,
        quantityTiers: [quantityTierSchema],
      },
    ],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Hydrolate", "Argan Products", "Oils", "Para Pharma", "Skin Care"],
    required: true,
  },
  basePrice: {
    type: Number,
    required: true, // Base price when no characteristics are selected
  },

  // Main product image
  mainImage: {
    type: String, // URL to main product image
    required: true,
  },

  // Additional product images (gallery)
  images: [
    {
      type: String, // URLs to additional product images
    },
  ],

  // Flexible characteristics system
  characteristics: [characteristicSchema],

  // Simple quantity tiers for products without size/material variations
  quantityTiers: [quantityTierSchema],

  // Stock management
  inStock: {
    type: Boolean,
    default: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
  },

  // SEO and metadata
  slug: {
    type: String,
    unique: true,
  },
  tags: [String],

  // Product status
  isActive: {
    type: Boolean,
    default: true,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to update updatedAt and generate slug
productSchema.pre("save", function (next) {
  this.updatedAt = new Date();

  // Generate slug from name if not provided
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  next();
});

// Index for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ name: "text", description: "text" });

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
