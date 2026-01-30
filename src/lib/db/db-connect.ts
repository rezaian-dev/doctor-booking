import { connection, connect } from "mongoose";

// 🔒 Validate and cache MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI environment variable is required");
}

// 🚀 Connect to MongoDB with singleton pattern
export const connectDB = async () :Promise<void> => {
  if (connection.readyState === 1) return; // ✅ Already connected

  try {
    await connect(MONGODB_URI,{serverSelectionTimeoutMS:5000,socketTimeoutMS:45000})
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error; // 🔄 Re-throw to handle in API routes
  }
};
