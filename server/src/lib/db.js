import mongoose from "mongoose";
import { config } from "../config/index.js";

export async function connectDB() {
  try {
    const mongoURI = config.mongoUri;

    if (!mongoURI) {
      throw new Error("MongoDB connection string is missing. Please configure MONGO_URI.");
    }

    console.log("Connecting to MongoDB...");

    const connection = await mongoose.connect(mongoURI);

    console.log(`MongoDB connected successfully: ${connection.connection.host}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}
