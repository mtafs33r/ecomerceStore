import mongoose from "mongoose";

let isConnected = false; // Track connection state

const connectDB = async () => {
  // Check if already connected
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  // Check if connection string exists
  if (!process.env.MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI environment variable is not defined");
  }

  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    console.log(
      "📝 Connection URI:",
      process.env.MONGO_DB_URI ? "✅ URI is set" : "❌ URI is missing"
    );

    // Connect to MongoDB with proper options
    await mongoose.connect(process.env.MONGO_DB_URI, {
      // These options help with connection stability
      bufferCommands: false,
    });

    isConnected = true;
    console.log("✅ ========================================");
    console.log("✅ Connected to MongoDB successfully!");
    console.log("✅ Database:", mongoose.connection.name);
    console.log("✅ Host:", mongoose.connection.host);
    console.log("✅ ========================================");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("❌ Error details:", error);
    isConnected = false;
    throw error; // Re-throw to allow caller to handle
  }
};

export { connectDB };
export default connectDB;
