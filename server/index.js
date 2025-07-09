import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import placeRoutes from "./routes/placeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://your-vercel-frontend.vercel.app",
		],
		credentials: true,
	})
);
app.use(express.json());

// Routes
app.use("/api/places", placeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);

// Start server
async function startServer() {
	try {
		await connectDB();
		console.log("✅ Connected to MongoDB");

		const PORT = process.env.PORT || 4000;
		app.listen(PORT, () => {
			console.log(`🚀 Backend running on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error("❌ Failed to start server:", err.message);
		process.exit(1);
	}
}

startServer();
