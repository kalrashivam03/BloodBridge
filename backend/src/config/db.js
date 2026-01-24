import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectDB = async () => {
    try {
        if (!ENV.MONGO_URI) {
            throw new Error("MONGO_URI is missing in environment variables");
        }

        await mongoose.connect(ENV.MONGO_URI);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
