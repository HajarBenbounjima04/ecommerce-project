import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    selectedSize: {
      value: Number,
      unit: String,
    },
    selectedMaterial: {
      name: String,
    },
    // ✅ Ajouter ce champ pour les caractéristiques "other"
    selectedCharacteristics: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    priceAtAdd: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default cartModel;
