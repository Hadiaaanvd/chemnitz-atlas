import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve path to .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
	try {
		const MONGO_URI = process.env.MONGO_URI;
		if (!MONGO_URI) throw new Error("MONGO_URI is undefined");

		await mongoose.connect(MONGO_URI);
		console.log("✅ Connected to MongoDB");
	} catch (err) {
		console.error("❌ MongoDB connection error:", err.message);
		process.exit(1);
	}
};

export default connectDB;
