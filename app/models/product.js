import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
    category: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent model recompilation in development
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
