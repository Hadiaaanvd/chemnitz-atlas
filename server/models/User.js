import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	email: { type: String, unique: true },
	password: String,
	name: String,
	location: String,
	favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
	isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
