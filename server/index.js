import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";
import placeRoutes from "./routes/placeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/places", placeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);

// Start server
async function startServer() {
	try {
		await connectDB();
		console.log("Connected to MongoDB");
		app.listen(4000, () => {
			console.log("Backend running on http://localhost:4000");
		});
	} catch (err) {
		console.error("Failed to start server:", err.message);
		process.exit(1);
	}
}

startServer();
