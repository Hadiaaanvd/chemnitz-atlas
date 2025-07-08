import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: String,
	},
	{ timestamps: true }
);
const placeSchema = new mongoose.Schema(
	{
		osmId: { type: String, required: true, unique: true },
		name: String,
		category: String,
		lat: Number,
		lon: Number,
		description: String,
		website: String,
		address: String,
		rating: { type: Number, default: 0 }, // average rating
		reviews: [reviewSchema],
	},
	{ timestamps: true }
);

export default mongoose.model("Place", placeSchema);
