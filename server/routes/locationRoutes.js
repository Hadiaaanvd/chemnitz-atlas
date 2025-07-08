// routes/locationRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/search", async (req, res) => {
	try {
		const response = await axios.get(
			"https://nominatim.openstreetmap.org/search",
			{
				params: {
					q: req.query.q,
					format: "json",
					addressdetails: 1,
					limit: 5,
					viewbox: "12.8874,50.8615,12.9513,50.7950", // Chemnitz bbox
					bounded: 1,
				},
				headers: {
					// "User-Agent": "ChemnitzAtlasApp/1.0 (hadiaaanvd@gmail.com)",
				},
			}
		);
		res.json(response.data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch location" });
	}
});

export default router;
