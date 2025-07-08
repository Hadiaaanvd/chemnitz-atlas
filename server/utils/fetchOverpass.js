import axios from "axios";
import connectDB from "./db.js";
import Place from "../models/Place.js";

function generateDummyDescription() {
	const options = [
		"A popular local spot for food and culture.",
		"Known for its unique atmosphere and historical value.",
		"Visitors love this place for its charm and character.",
		"A must-visit location in Chemnitz!",
		"Perfect for a relaxing evening or family outing.",
	];
	return options[Math.floor(Math.random() * options.length)];
}

const overpassQuery = `
[out:json][timeout:60];
area["name"="Chemnitz"]->.searchArea;
(
  node["amenity"="restaurant"](area.searchArea)(50.7413,12.7272,50.9037,13.0542);
  node["tourism"="museum"](area.searchArea)(50.7413,12.7272,50.9037,13.0542);
  node["amenity"="theatre"](area.searchArea)(50.7413,12.7272,50.9037,13.0542);
  node["tourism"="artwork"](area.searchArea)(50.7413,12.7272,50.9037,13.0542);
);
out center;
`;

async function fetchAndStorePlaces() {
	try {
		await connectDB();
		console.log("Connected to MongoDB");

		const { data } = await axios.post(
			"https://overpass-api.de/api/interpreter",
			overpassQuery,
			{
				headers: { "Content-Type": "text/plain" },
			}
		);

		const elements = data.elements;

		for (const item of elements) {
			const { id, tags, lat, lon } = item;

			const place = {
				osmId: String(id),
				name: tags?.name || "Unnamed",
				category: tags?.tourism || tags?.amenity || "unknown",
				lat,
				lon,
				website: tags?.website || "",
				address: `${tags["addr:street"] || ""} ${
					tags["addr:housenumber"] || ""
				}`.trim(),
				description: tags?.description || generateDummyDescription(),
				reviews: [
					{
						user: "68667482a28d780d01a2943e",
						rating: Math.floor(Math.random() * 3) + 3,
						comment: "Really nice place!",
					},
				],
				rating: Math.floor(Math.random() * 3) + 3,
				...tags,
			};

			await Place.updateOne(
				{ osmId: place.osmId },
				{ $set: place },
				{ upsert: true }
			);
		}

		console.log(`Saved ${elements.length} places to MongoDB`);
		process.exit(0);
	} catch (error) {
		console.error("Error fetching/storing Overpass data:", error.message);
		process.exit(1);
	}
}

fetchAndStorePlaces();
