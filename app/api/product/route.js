import { NextResponse } from "next/server";
import connectDB from "@/app/config/db"; // Import your connectDB function
import Product from "@/app/models/product"; // Import your Product model

// GET - Fetch all products or a single product by ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    // If params.id exists, fetch single product
    if (params?.id) {
      const product = await Product.findById(params.id);

      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, data: product },
        { status: 200 }
      );
    }

    // Fetch all products
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: products, count: products.length },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description, price, quantity, category } = body;

    // Validation
    if (
      !name ||
      !description ||
      price === undefined ||
      quantity === undefined
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      category: category || "General",
    });

    return NextResponse.json(
      { success: true, data: product, message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a product by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    // Find and update product
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: product, message: "Product updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: {}, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
