import express from "express";
import Place from "../models/Place.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const places = await Place.find();
	res.json(places);
});

router.post("/:id/reviews", authMiddleware, async (req, res) => {
	const { rating, comment, username } = req.body;
	const user = req.user;

	try {
		const place = await Place.findById(req.params.id);
		if (!place) return res.status(404).json({ message: "Place not found" });

		// Debugging
		console.log("Incoming review from user:", user._id);
		console.log(
			"Existing reviews:",
			place.reviews.map((r) => r.user?.toString())
		);

		// Check if user already reviewed this place
		const existingReview = place.reviews.find(
			(r) => r.user?.toString() === user._id.toString()
		);

		if (existingReview) {
			// Update the existing review
			existingReview.rating = rating;
			existingReview.comment = comment;
			existingReview.updatedAt = new Date();
			existingReview.userName = username;
		} else {
			// Add new review
			place.reviews.push({
				user: user._id,
				userName: username,
				rating,
				comment,
			});
		}

		// Recalculate average rating
		const total = place.reviews.reduce((sum, r) => sum + r.rating, 0);
		place.rating = total / place.reviews.length;

		await place.save();
		res.json({
			message: existingReview ? "Review updated" : "Review added",
			place,
		});
	} catch (err) {
		console.error("Error saving review:", err);
		res.status(500).json({ message: "Error saving review" });
	}
});

export default router;
